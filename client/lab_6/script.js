
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function injectHTML (list) {
  console.log('fired injectHTML');
  const target = document.querySelector('#restaurant_list'); // selects text in restaurant_list
  target.innerHTML = ''; // make sure restaurant_list is blank
  list.forEach((item) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase(); // PIZZA -> pizza
    const lowerCaseQuery = query.toLowerCase(); // PiZzA -> pizza
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function cutRestaurantList(list) {
  console.log('fired cut list');
  const range = [...Array(15).keys()]; // makes an array of 15 elements
  return newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length-1);
    return list[index];
  });
}

async function mainEvent() { // the async keyword means we can make API requests
  const mainForm = document.querySelector('.main_form'); // This class name needs to be set on your form before you can listen for an event on it
  const filterDataButton = document.querySelector('#filter'); // querySelector that targets your Filter Data button here
  const loadDataButton = document.querySelector('#data_load'); // querySelector that targets your Load County Data button here
  const generateListButton = document.querySelector('#generate'); // querySelector that targets your Generate List button here
  let currentList = []; // this is "scoped" to the main event function
  
  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener('click', async (submitEvent) => { // async has to be declared on every function that needs to "await" something
    submitEvent.preventDefault(); // This prevents your page from becoming a list of 1000 records from the county, even if your form still has an action set on it
    console.log('form submission'); // this is substituting for a "breakpoint" - it prints to the browser to tell us we successfully submitted the form

    // Basic GET request - this replaces the form Action
    const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');

    // This changes the response from the GET into data we can use - an "object"
    currentList = await results.json();
    console.table(currentList); 
    injectHTML(currentList);
  });


  // FILTER BUTTON
  filterDataButton.addEventListener('click', (event) => {
    console.log("clicked filterDataButton"); // log out clicks for easier debugging
    
    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);

    console.log(formProps);

    // Using the filterList function, filter the list
    const newList = filterList(currentList, formProps.resto);
    // and log out th new list
    console.log(newList);
    injectHTML(newList);
  });

  // GENERATE LIST BUTTON
  generateListButton.addEventListener('click', (event) => {
    console.log('generate new list');
    const restaurantList = cutRestaurantList(currentList);
    injectHTML(restaurantList);
  });
}


/*
  This adds an event listener that fires our main event only once our page elements have loaded
  The use of the async keyword means we can "await" events before continuing in our scripts
  In this case, we load some data when the form has submitted
*/
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
