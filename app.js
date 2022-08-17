// Storage Controller

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
    getTotalCalories: () => {
      return data.items.reduce(
        (previousValue, item) => previousValue + item.calories,
        0
      );
    },
    getItemById: (id) => {
      let itemFound;
      data.items.forEach((item) => {
        if (item.id === id) {
          itemFound = item;
        }
      });
      return itemFound;
    },
    setCurrentItem: (item) => {
      data.currentItem = item;
    },
    getCurrentItem: () => {
      return data.currentItem;
    },
    updateItem: (itemEdited, name, calories) => {
      data.items.forEach((item) => {
        if (itemEdited.id === item.id) {
          item.name = name;
          item.calories = parseInt(calories);
        }
      });
    },
    deleteItem: () => {
      data.items = data.items.filter((item) => item.id !== data.currentItem.id);
      console.log(data.items);
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
    totalCalories: document.querySelector(".total-calories"),
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
    // Update Calories Total
    updateTotalCalories(total) {
      UISelectors.totalCalories.innerHTML = `${total}`;
    },
    // Clear edit fields
    clearEditState: () => {
      UIController.clearFields();
      UISelectors.updateButton.style.display = "none";
      UISelectors.deleteButton.style.display = "none";
      UISelectors.backButton.style.display = "none";
      UISelectors.addButton.style.display = "inline";
    },
    showEditState: () => {
      UISelectors.updateButton.style.display = "inline";
      UISelectors.deleteButton.style.display = "inline";
      UISelectors.backButton.style.display = "inline";
      UISelectors.addButton.style.display = "none";
    },
    // add items to be edited to the input fields
    addItemToForm: () => {
      UISelectors.itemCalories.value = ItemController.getCurrentItem().calories;
      UISelectors.itemName.value = ItemController.getCurrentItem().name;
      UIController.showEditState();
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
    // Add Item Events
    UISelectors.addButton.addEventListener("click", itemAddSubmit);
    // Edit Item Event
    UISelectors.itemList.addEventListener("click", itemEditClick);
    // Update Edited Item Event
    UISelectors.updateButton.addEventListener("click", itemUpdateSubmit);
    // Delete  Item Event
    UISelectors.deleteButton.addEventListener("click", itemDeleteSubmit);
    // Back Button
    UISelectors.backButton.addEventListener(
      "click",
      UIController.clearEditState
    );
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
      // Get Total Calories and update it in the user interface
      UIController.updateTotalCalories(ItemController.getTotalCalories());

      UIController.showList();
    }
    e.preventDefault();
  };

  // Edit Item Method
  const itemEditClick = (e) => {
    if (e.target.classList.contains("edit-item")) {
      // Get list item id
      let listId = e.target.parentElement.parentElement.id;
      // only get the number part after the dash and parse it to number
      listId = parseInt(listId.split("-")[1]);
      // get the item from the item list by id
      const itemToEdit = ItemController.getItemById(listId);
      // set current item in the data structure
      ItemController.setCurrentItem(itemToEdit);
      // Add item fields to input fields
      UIController.addItemToForm();
    }
    e.preventDefault();
  };

  // Submit the updated item
  const itemUpdateSubmit = (e) => {
    // get item input from user interface
    const itemInput = UIController.getItemInput();

    // Check if anything entered in form fields
    if (itemInput.name !== "" && itemInput.calories !== "") {
      // update the item in the list
      ItemController.updateItem(
        ItemController.getCurrentItem(),
        itemInput.name,
        itemInput.calories
      );
      // Fetch Items from Data Structure
      const items = ItemController.getItems();
      // Populate list with items
      UIController.populateItemList(items);
      // Clear Input Fields
      UIController.clearFields();
      // Get Total Calories and update it in the user interface
      UIController.updateTotalCalories(ItemController.getTotalCalories());

      UIController.clearEditState();
      UIController.showList();
    }

    e.preventDefault();
  };

  // Delete the selected item
  const itemDeleteSubmit = (e) => {
    ItemController.deleteItem();
    // Fetch Items from Data Structure
    const items = ItemController.getItems();
    // Populate list with items
    UIController.populateItemList(items);
    // Clear Input Fields
    UIController.clearFields();
    // Get Total Calories and update it in the user interface
    UIController.updateTotalCalories(ItemController.getTotalCalories());

    UIController.clearEditState();
    UIController.showList();
  };

  // Public Methods
  return {
    init: () => {
      // Set initial state
      UIController.clearEditState();
      // Fetch Items from Data Structure
      const items = ItemController.getItems();
      if (items.length === 0) {
        UIController.hideList();
      } else {
        // Populate list with items
        UIController.populateItemList(items);
        // Get Total Calories and update it in the user interface
        UIController.updateTotalCalories(ItemController.getTotalCalories());
      }
      // Load Event Listeners
      loadEventListeners();
    },
  };
})(ItemController, UIController);

// Initialize App
App.init();
