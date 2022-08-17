// Storage Controlle

// Item Controller
const ItemController = (() => {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: [
      // { id: 0, name: "Steak Dinner", calories: 1200 },
      // { id: 1, name: "Ice Cream", calories: 800 },
      // { id: 2, name: "Eggs", calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };

  // Public Methods
  return {
    getItems: () => {
      return data.items;
    },
    logData: () => {
      return data;
    },
    addItem: (name, calories) => {
      // Create ID
      let ID = data.items.length > 0 ? data.items.length : 0;
      // parse calories string to number
      calories = parseInt(calories);
      // create new item
      const item = new Item(ID, name, calories);
      // push it to the items array
      data.items.push(item);
      // return the item
      return item;
    },
  };
})();

// UI Controller
const UIController = (() => {
  // const itemList = document.querySelector("#item-list");
  const UISelectors = {
    itemList: document.querySelector("#item-list"),
    addButton: document.querySelector(".add-btn"),
    updateButton: document.querySelector(".update-btn"),
    deleteButton: document.querySelector(".delete-btn"),
    backButton: document.querySelector(".back-btn"),
    itemName: document.querySelector("#item-name"),
    itemCalories: document.querySelector("#item-calories"),
  };
  // Public Methods
  return {
    populateItemList: (items) => {
      let html = "";
      items.forEach((item) => {
        html += `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"
            ><i class="edit-item fa-solid fa-pencil"></i>
          </a>
        </li>
      `;
      });
      // insert list items
      UISelectors.itemList.innerHTML = html;
    },

    // Make Selectors Public
    getSelectors: () => {
      return UISelectors;
    },
    // get Item Input from UI
    getItemInput: () => {
      return {
        name: UISelectors.itemName.value,
        calories: UISelectors.itemCalories.value,
      };
    },
    // Clear input fields
    clearFields: () => {
      UISelectors.itemCalories.value = "";
      UISelectors.itemName.value = "";
    },
    // Hide meals list
    hideList: () => {
      UISelectors.itemList.style.display = "none";
    },
    // Show meals list
    showList: () => {
      UISelectors.itemList.style.display = "block";
    },
  };
})();

// App Controller
const App = ((ItemController, UIController) => {
  // Load Event Listeners
  const loadEventListeners = () => {
    // get Selectors
    const UISelectors = UIController.getSelectors();
    // Add Event Listeners
    UISelectors.addButton.addEventListener("click", itemAddSubmit);
  };

  // Add Item Submit
  const itemAddSubmit = (e) => {
    // get item input from user interface
    const itemInput = UIController.getItemInput();

    // Check if anything entered in form fields
    if (itemInput.name !== "" && itemInput.calories !== "") {
      // add item to the list
      const newItem = ItemController.addItem(
        itemInput.name,
        itemInput.calories
      );
      // Fetch Items from Data Structure
      const items = ItemController.getItems();
      // Populate list with items
      UIController.populateItemList(items);
      // Clear Input Fields
      UIController.clearFields();
      UIController.showList();
    }
    e.preventDefault();
  };

  // Public Methods
  return {
    init: () => {
      // Fetch Items from Data Structure
      const items = ItemController.getItems();
      if (items.length === 0) {
        UIController.hideList();
      } else {
        // Populate list with items
        UIController.populateItemList(items);
      }
      // Load Event Listeners
      loadEventListeners();
    },
  };
})(ItemController, UIController);

// Initialize App
App.init();
