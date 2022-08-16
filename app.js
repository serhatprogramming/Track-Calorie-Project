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
      { id: 0, name: "Steak Dinner", calories: 1200 },
      { id: 1, name: "Ice Cream", calories: 800 },
      { id: 2, name: "Eggs", calories: 300 },
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
  };
})();

// UI Controller
const UIController = (() => {
  // const itemList = document.querySelector("#item-list");
  const UISelectors = {
    itemList: document.querySelector("#item-list"),
    addButton: document.querySelector("#item-list"),
    editButton: document.querySelector("#item-list"),
    deleteButton: document.querySelector("#item-list"),
    backButton: document.querySelector("#item-list"),
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
  };
})();

// App Controller
const App = ((ItemController, UIController) => {
  // Load Event Listeners
  const loadEventListeners = () => {
    // get Selectors
    const UISelectors = UIController.getSelectors();
  };

  // Public Methods
  return {
    init: () => {
      // Fetch Items from Data Structure
      const items = ItemController.getItems();
      // Populate list with items
      UIController.populateItemList(items);
    },
  };
})(ItemController, UIController);

// Initialize App
App.init();
