function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }
  
  function injectHTML(list) {
    console.log("fired injectHTML");
    const target = document.querySelector("#restaurant_list"); // selects text in restaurant_list
    target.innerHTML = ""; // make sure restaurant_list is blank
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
    console.log("fired cut list");
    const range = [...Array(15).keys()]; // makes an array of 15 elements
    return (newArray = range.map((item) => {
      const index = getRandomIntInclusive(0, list.length - 1);
      return list[index];
    }));
  }
  
  async function mainEvent() {
    // the async keyword means we can make API requests
    const mainForm = document.querySelector(".main_form"); // This class name needs to be set on your form before you can listen for an event on it
    const filterDataButton = document.querySelector("#filter"); // querySelector that targets your Filter Data button here
    const loadDataButton = document.querySelector("#data_load"); // querySelector that targets your Load County Data button here
    const generateListButton = document.querySelector("#generate"); // querySelector that targets your Generate List button here
    const textField = document.querySelector("#resto");
  
    const loadAnimation = document.querySelector("#data_load_animation");
    loadAnimation.style.display = "none";
    generateListButton.classList.add("hidden");
  
    let storedList = [];
    let currentList = []; // this is 'scoped' to the main event function
  
    /* LOAD DATA BUTTON */
    loadDataButton.addEventListener("click", async (submitEvent) => {
      // async has to be declared on every function that needs to 'await' something
      console.log("Loading Data"); // this is substituting for a 'breakpoint' - it prints to the browser to tell us we successfully submitted the form
      loadAnimation.style.display = "inline-block";
  
      // Basic GET request - this replaces the form Action
      const results = await fetch(
        "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json"
      );
  
      // This changes the response from the GET into data we can use - an 'object'
      storedList = await results.json();
      if (storedList.length > 0) {
        generateListButton.classList.remove("hidden");
      }
  
      loadAnimation.style.display = "none";
      console.table(storedList);
    });
  
    /* FILTER BUTTON */
    // sets current list to be something and injects new list
    filterDataButton.addEventListener("click", (event) => {
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
  
    /* GENERATE LIST BUTTON */
    // generates list and injects it without changing original
    generateListButton.addEventListener("click", (event) => {
      console.log("generate new list");
      currentList = cutRestaurantList(storedList);
      console.log(currentList);
      injectHTML(currentList);
    });
  
    textField.addEventListener("input", (event) => {
      console.log("input", event.target.value);
      const newList = filterList(currentList, event.target.value);
      console.log(newList);
      injectHTML(newList);
    });
  }
  
  document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
  