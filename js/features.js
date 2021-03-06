//Add the features list
jviz.modules.karyoviewer.prototype.features = function(list)
{
  //Check the features list
  if(typeof list === 'undefined'){ return this._features.list; }

  //Check for array
  if(jviz.is.array(list) === false){ list = [ list ]; }

  //Reset the features list
  this._features.list = [];

  //Reset the features by chromosomes
  this._features.chromosomes = {};

  //Reset the features counter list
  this._features.counter.list = {};

  //Features counter
  var index = 0;

  //Read all the features
  for(var i = 0; i < list.length; i++)
  {
    //Clone the feature
    //var feature = Object.assign({}, list[i]);
    var feature = list[i];

    //Check the chromosome
    if(typeof feature.chromosome !== 'string'){ console.error('Undefined chromosome on feature ' + i); continue; }

    //Check the feature start position
    if(typeof feature.start === 'undefined'){ console.error('Undefined start on feature ' + i); continue; }

    //Check the feature name
    if(typeof feature.name !== 'string'){ console.error('Undefined name on feature ' + i); continue; }

    //Parse the feature start position
    feature.start = parseInt(feature.start);

    //Save the feature end point
    feature.end = (typeof feature.end === 'undefined') ? feature.start : parseInt(feature.end);

    //Save the feature length
    feature.length = Math.abs(feature.end - feature.start) + 1;

    //Extend the feature
    feature = Object.assign(feature, { _posx: 0, _posy: 0, _width: 0, _height: 0, _chromosome: -1 });

    //Add the feature index
    feature._index = index;

    //Add the feature color
    feature._color = (typeof feature.color === 'string') ? feature.color : this._features.color;

    //Save this feature
    this._features.list.push(feature);

    //Check if chromosome exists
    if(typeof this._features.chromosomes[feature.chromosome] === 'undefined')
    {
      //Initialize this chromosome
      this._features.chromosomes[feature.chromosome] = [];
    }

    //Add the index
    this._features.chromosomes[feature.chromosome].push(index);

    //Add the features counter
    this._features.counter.list[feature.chromosome] = new jviz.canvas.tooltip({ color: this._features.color });

    //Increment the features counter
    index = index + 1;
  }

  //Set to resize the features
  this._features.resized = false;

  //Continue
  return this;
};

//Resize the features data
jviz.modules.karyoviewer.prototype.featuresResize = function()
{
  //Get the draw info
  var draw = this._block.draw;

  //Get margins
  var margin = this._block.margin;

  //Read all the chromosomes
  for(var i = 0; i < this._chromosomes.list.length; i++)
  {
    //Get the chromosome info
    var chr = this._chromosomes.list[i];

    //Get the features
    var features = this._features.chromosomes[chr.name];

    //Check features on this chromosome
    if(typeof features === 'undefined'){ continue; }

    //Red all features
    for(var j in features)
    {
      //Get the feature
      var feature = this._features.list[j];

      //Check for landscape
      if(this.isLandscape() === true)
      {
        //Save the feature width
        feature._width = Math.max(draw.width * feature.length / this._chromosomes.max, 1);

        //Save the feature height
        feature._height = this._chromosomes.height;

        //Save the feature position x
        feature._posx = chr._posx + draw.width * Math.min(feature.start, feature.end) / this._chromosomes.max;

        //Save the feature position y
        feature._posy = chr._posy;
      }

      //Check for portrait
      else
      {
        //Save the feature width for portrait
        feature._width = this._chromosomes.width;

        //Save the feature height for portrait
        feature._height = Math.max(draw.height * feature.length / this._chromosomes.max, 1);

        //Save the feature position x for portrait
        feature._posx = chr._posx;

        //Save the feature position y for portrait
        feature._posy = chr._posy + draw.height * Math.min(feature.start, feature.end) / this._chromosomes.max;
      }

      //Add the chromosome index
      feature._chromosome = i;

      //Save the feature object
      this._features.list[j] = feature;
    }

    //Initialize the counter positions object
    var counter = { posx: 0, posy: 0, position: 'top' };

    //Check for landscape
    if(this.isLandscape() === true)
    {
      //Calculate the position x
      counter.posx = chr._posx + chr._width + this._features.counter.margin;

      //Calculate the position y
      counter.posy = chr._posy + chr._height / 2;

      //Set the tooltip position
      counter.position = 'right';
    }

    //Check for portrait
    else
    {
      //Calculate the tooltip position x
      counter.posx = chr._posx + chr._width / 2;

      //Calculate the tooltip position y
      counter.posy = chr._posy - this._features.counter.margin;

      //Set the tooltip position
      counter.position = 'top';
    }

    //Move the counter object
    this._features.counter.list[chr.name].move(counter);

    //Set the tooltip position
    this._features.counter.list[chr.name].position(counter.position);

    //Set the number of features
    this._features.counter.list[chr.name].text(features.length + '');
  }

  //Set features resized
  this._features.resized = true;

  //Continue
  return this;
};

//Draw the features
jviz.modules.karyoviewer.prototype.featuresDraw = function()
{
  //Get the canvas
  var canvas = this._canvas.el.layer(this._features.layer);

  //Read all the chromosomes
  for(var i = 0; i < this._chromosomes.list.length; i++)
  {
    //Get the chromosome
    var chr = this._chromosomes.list[i];

    //Get the features for this chromosome
    var features = this._features.chromosomes[chr.name];

    //Check for undefined
    if(typeof features !== 'object'){ continue; }

    //Red all features
    for(var j in features)
    {
      //Get this feature
      var feature = this._features.list[j];

      //Draw the feature
      canvas.Rect({ x: feature._posx, y: feature._posy, width: feature._width, height: feature._height });

      //feature fill
      canvas.Fill({ color: feature._color, opacity: this._features.opacity });
    }

    //Check for drawing the features counter
    if(this._features.counter.visible === false){ continue; }

    //Check for no features
    if(features.length === 0){ continue; }

    //Draw the counter tooltip
    this._features.counter.list[chr.name].draw(canvas);
  }

  //Exit
  return this;
};

//Update the features info
jviz.modules.karyoviewer.prototype.featuresMap = function(fn)
{
  //Check the function
  if(typeof fn !== 'function'){ return this; }

  //Read all the features
  for(var i = 0; i < this._features.list.length; i++)
  {
    //Get the feature
    var feature = this._features.list[i];

    //Parse the feature
    var new_feature = fn(feature, index);

    //Check for undefined new feature
    if(typeof new_feature !== 'object'){ continue; }

    //Update the original feature
    this._features.list[i] = Object.assign(feature, new_feature);
  }

  //Return this and exit
  return this;
};

//Update the feature color
jviz.modules.karyoviewer.prototype.featuresColor = function(fn)
{
  //Check the function
  if(typeof fn !== 'function'){ return this; }

  //Read the full list
  for(var i = 0; i < this._features.list.length; i++)
  {
    //Get the feature of this draw object
    var feature = this._features.list[j];

    //Get the color
    var color = fn(feature, feature._color, this._features.color);

    //Check for undefined string
    if(typeof color !== 'string'){ continue; }

    //Update the object color
    this._features.list[j]._color = color;
  }

  //Continue
  return this;
};
