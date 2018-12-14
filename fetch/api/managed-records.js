import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...


var AdjustColors = (array) => {
  var string = "";
  array.forEach((item) => {
    string += `color[]=${item}&`;
  });
  string = string.slice(0, -1);
  return string;
};

var AdjustOffset = (num) => {
  return (num * 10) - 10;
};


var transformPayload = (array, page, flag) => {
  var primaryColors = ['red', 'blue', 'yellow'];
  var transformedObject = {
    ids: [], 
    open: [], 
    closedPrimaryCount: 0, 
    previousPage: 0,
    nextPage: 0
  };
    array.forEach( (item) => {
      transformedObject.ids.push(item.id);
      
      if (item.disposition === 'open') {
        if (primaryColors.indexOf(item.color) !== -1) {
          item.isPrimary = true;
          transformedObject.open.push(item);
        } else {
          item.isPrimary = false; 
          transformedObject.open.push(item);
        }
      } else {
        if (primaryColors.indexOf(item.color) !== -1) {
          transformedObject.closedPrimaryCount++;
        }
      }
      
        if (flag === false) {
          transformedObject.previousPage = null;
          transformedObject.nextPage = null;
        } else {
          if (page === 1 ) {
            transformedObject.previousPage = null;
            transformedObject.nextPage = page + 1;
        } else if ( page === 50 ) {
            transformedObject.previousPage = page - 1;
            transformedObject.nextPage = null;
        } else if ( page > 1 && page < 50 ) {
            transformedObject.previousPage = page - 1;
            transformedObject.nextPage = page + 1;
        } else {
            transformedObject.previousPage = null;
            transformedObject.nextPage = null;
        }
      }
   });
   return transformedObject; 
};


var retrieve = (options) => {
  var page =  AdjustOffset(options.page) || 1;
  var colors =  AdjustColors(options.colors)|| ["red", "brown", "blue", "yellow", "green"];
  var flag = false;

// // `${window.path}?limit=10&offset=${offset}&${colors}`
 return fetch(`${window.path}?limit=10&offset=${page}&${colors}`)
    .then( (response) => {
      return response.json();
    })
    .then( (data) => {
      console.log('here is the requested data', data);
      flag = true;
      return transformPayload(data, options.page, flag);
    })
    .catch( (error) => {
      console.log('following error has occured while retrieving requested data', error);
    }) 
   


   // var promise = new Promise(function(resolve, reject) {
   //     return fetch(`${window.path}?limit=10&offset=${page}&${colors}`)
   //            .then(function(response) {
   //              return response.json();
   //            })
   //            .then
   // });


};


export default retrieve;
