//Add the features list
jviz.modules.karyoviewer.prototype.features = function(list)
{
  //Check the features list
  if(typeof list === 'undefined'){ return this; }

  //Check for array
  if(jviz.is.array(list) === false){ list = [ list ]; }

  //Reset the features list
  this._features.list = [];

  //Reset the features list by chromosomes
  this._features.chromosomes = {};

  //Read all the features
  for(var i = 0; i < list.length; i++)
  {
    //Get the feature
    var feature = list[i];

    //Initialize the new feature object
    var obj_feature = { posx: 0, posy: 0, width: 0, height: 0 };

    //Save the feature chromosome
    obj_feature.chromosome = feature.chromosome;

    //Save the feature start point
    obj_feature.start = parseInt(feature.start);

    //Save the feature end point
    obj_feature.end = (typeof feature.end === 'undefined') ? obj_feature.start : parseInt(feature.end);

    //Save the feature length
    obj_feature.length = Math.abs(obj_feature.end - obj_feature.start) + 1;

    //Save the feature index
    obj_feature.index = i;

    //Save the feature start position
    //obj.start = draw.height * (feature.start / this._chromosomes.max);

    //Save the feature end position
    //obj.end = draw.height * (feature.end / this._chromosomes.max);

    //feature width
    //obj.width = this._chromosomes.width;

    //feature height
    //obj.height = Math.max(Math.abs(obj.end - obj.start), 1);

    //Add the feature color
    obj_feature.color = (typeof feature.color === 'string') ? feature.color : this._features.color;

    //Check if chromosome exists
    if(typeof this._features.chromosomes[feature.chromosome] === 'undefined')
    {
      //Add this chromosome
      this._features.chromosomes[feature.chromosome] = [];
    }

    //Add the index to the chromosome list
    this._features.chromosomes[feature.chromosome].push(i);

    //Add to the list
    this._features.list.push(obj_feature);
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
    //Get the chromosome
    var chr = this._chromosomes.list[i];

    //Check features on this chromosome
    if(typeof this._features.chromosomes[chr.name] === 'undefined'){ continue; }

    //Get the features list
    var features = this._features.chromosomes[chr.name];

    //Red all features
    for(var j in features)
    {
      //Get the feature object
      var feature = this._features.list[j];

      //Check for landscape
      if(this.isLandscape() === true)
      {
        //Save the feature width
        feature.width = Math.max(draw.width * feature.length / this._chromosomes.max, 1);

        //Save the feature height
        feature.height = this._chromosomes.height;

        //Save the feature position x
        feature.posx = chr.posx + draw.width * Math.min(feature.start, feature.end) / this._chromosomes.max;

        //Save the feature position y
        feature.posy = chr.posy;
      }

      //Check for portrait
      else
      {
        //Save the feature width for portrait
        feature.width = this._chromosomes.width;

        //Save the feature height for portrait
        feature.height = Math.max(draw.height * feature.length / this._chromosomes.max, 1);

        //Save the feature position x for portrait
        feature.posx = chr.posx;

        //Save the feature position y for portrait
        feature.posy = chr.posy + draw.height * Math.min(feature.start, feature.end) / this._chromosomes.max;
      }

      //Save the feature object
      this._features.list[index] = feature;
    }

    //Get the features counter object
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

    //Check features on this chromosome
    if(typeof this._features.chromosomes[chr.name] === 'undefined'){ continue; }

    //Get the features list
    var features = this._features.list[chr.name];

    //Red all features
    for(var j in features)
    {
      //Get this feature
      var feature = this._features.list[j];

      //Draw the feature
      canvas.Rect({ x: feature.posx, y: feature.posy, width: feature.width, height: feature.height });

      //feature fill
      canvas.Fill({ color: feature.color, opacity: this._features.opacity });
      /*

      //Check the features triangle
      if(this._features.triangle.visible === false){ continue; }

      //Get the triangle configuration
      var triangle = this._features.triangle;

      //Initialize the triangle array
      var triangle_points = [];

      //Add the first point
      triangle_points.push([ feature.posx - triangle.margin - triangle.width, feature.posy - triangle.height ]);

      //Add the middle point
      triangle_points.push([ feature.posx - triangle.margin, feature.posy ]);

      //Add the first point
      triangle_points.push([ feature.posx - triangle.margin - triangle.width, feature.posy + triangle.height ]);

      //Add the line
      canvas.Line(triangle_points);

      //Fill the triangle
      canvas.Fill({ color: feature.color, opacity: this._features.triangle.opacity });
      */
    }

    //Check for drawing the label
    //if(this._features.label.visible === false){ continue; }

    //Check for no features
    if(features.length === 0){ continue; }
  }

  //Exit
  return this;
};

//Get features by chromosome name
jviz.modules.karyoviewer.prototype.featuresByChromosome = function(name)
{
  //Check for no features on this chromosome
  if(typeof this._features.chromosomes[name] === 'undefined'){ return []; }
};
