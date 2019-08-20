//Storage Controller



//Item Controller
const ItemCtrl = (function() {
    //Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    //Data Structure / State
    const data = {
        item: [
            // {id: 0, name: "Steak Dinner", calories: 1200},
            // {id: 1, name: "Milk", calories: 200},
            // {id: 2, name: "Egg", calories: 300}
        ],
        currentItem : null,
        totalCalories : 0,
    }

    //Public function
    return {
        getItems: function(){
            return data.item;
        },
        addItem: function(name, calorie) {
            let ID;
            if(data.item.length>0) {
                ID = data.item[data.item.length-1].id + 1
            } else {
                ID = 0;
            }
            //calories to number
            calorie = parseInt(calorie);

            //Create new item
            newItem = new Item(ID, name, calorie);

            //add to items array
            data.item.push(newItem);

            return newItem;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getTotalCalories: function() {
            let total = 0;

            data.item.forEach(function(item){
                total += item.calories;
            })

            data.totalCalories = total;
            return data.totalCalories;
        },

        getItemByID: function(id) {
            let found = null;
            data.item.forEach(function(item){
                if(item.id === id) {
                    found = item; 
                }
            });
            return found;
        }, 

        updateItem: function(name, calories) {
            //Calories to number
             calories = parseInt(calories);

             let found = null;

             data.item.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id) {
            //get ids
            const ids = data.item.map(function(item){
                return item.id;
            })

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.item.splice(index,1);
        }, 

        clearAllItems: function() {
            data.item = [];
        },

        getCurrentItem: function() {
            return data.currentItem;
        },
        logData: function(){
            return data;
        }
    }
})();



//UI Controller
const UICtrl = (function() {
    const UISelector = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
    }
    //Public function
    return{
        populateItemList: function(items) {
            let html = '';

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });    
            
            // Insert List items
            document.querySelector(UISelector.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelector.itemNameInput).value,
                calorie: document.querySelector(UISelector.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            //show list items
            document.querySelector(UISelector.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            //Add class
            li.className = 'collection-item';
            //Add id
            li.id = `item-${item.id}`;
            //Add Html
            li.innerHTML = `<strong>${item.name}</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            //Insert item
            document.querySelector(UISelector.itemList).insertAdjacentElement('beforeend',li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelector.listItems);

            // turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            })
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();

        },
        deleteAllItems: function() {
            let listItems = document.querySelectorAll(UISelector.listItems);

            //Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item) {
                item.remove();
            })
        },
        clearFields: function(){
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function() {
            document.querySelector(UISelector.itemList).style.display = 'none';
        },
        showCalories: function(totalCalories){
            document.querySelector(UISelector.totalCalories).textContent = totalCalories;
        },
        clearEditState: function() {
            UICtrl.clearFields();
            document.querySelector(UISelector.updateBtn).style.display = 'none';
            document.querySelector(UISelector.deleteBtn).style.display = 'none';
            document.querySelector(UISelector.backBtn).style.display = 'none';
            document.querySelector(UISelector.addBtn).style.display = 'inline';
        },
        showEditState: function() {
            document.querySelector(UISelector.updateBtn).style.display = 'inline';
            document.querySelector(UISelector.deleteBtn).style.display = 'inline';
            document.querySelector(UISelector.backBtn).style.display = 'inline';
            document.querySelector(UISelector.addBtn).style.display = 'none';
        },
        getSelectors: function() {
            return UISelector;
        }
    }
})();



//App Controller
const App = (function(ItemCtrl, UICtrl) {
    //Load event listner
    const loadEventListner= function() {
        const UISelector = UICtrl.getSelectors();

        //Add item event
        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);

        //Disable submit on enter
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        }) 

        //Edit item click event
        document.querySelector(UISelector.itemList).addEventListener('click', itemEditClick);

        //Update item event
        document.querySelector(UISelector.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Delete item event
        document.querySelector(UISelector.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Back button event
        document.querySelector(UISelector.backBtn).addEventListener('click', backButtonFunc);

        //Clear item event
        document.querySelector(UISelector.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    const itemAddSubmit = function(e) {
        //Get form input from UI Controller
        const input = UICtrl.getItemInput();
        
        //check for name and calorie
        if(input.name !== '' && input.calorie !== '') {
            //Add item
            const newItem = ItemCtrl.addItem(input.name, input.calorie);

            //Add item to list
            UICtrl.addListItem(newItem);

            //Add calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //show calories in UI
            UICtrl.showCalories(totalCalories);

            //clear fields
            UICtrl.clearFields();
        }
        
        e.preventDefault();
    }
    //Click edit item icon
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-item')) {
            //Get list item id(item-0, item1)
            const listId = e.target.parentNode.parentNode.id;

            //Break into an array
            const listIdArr = listId.split('-');

            //Get the actual id
            const id = parseInt(listIdArr[1]);

            //Get item
            const itemToEdit = ItemCtrl.getItemByID(id);

            //Set item
            ItemCtrl.setCurrentItem(itemToEdit);

            //Add item to form
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }
    //Back button function
    const backButtonFunc = function(e) {
        UICtrl.clearEditState();
        e.preventDefault();
    }

    //update item submit
    const itemUpdateSubmit = function(e) {
        //Get item input
        const input = UICtrl.getItemInput();
        console.log(input);

        //update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calorie);
        console.log(updatedItem);
        // //Update UI
        UICtrl.updateListItem(updatedItem);

        //Add calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //show calories in UI
        UICtrl.showCalories(totalCalories);

        UICtrl.clearEditState();

        e.preventDefault();
    }
     //Delete button event
     const itemDeleteSubmit = function(e) {
        //get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //Delete from UI
        UICtrl.deleteListItem(currentItem.id);

         //Add calories
         const totalCalories = ItemCtrl.getTotalCalories();
         //show calories in UI
         UICtrl.showCalories(totalCalories);
 
         UICtrl.clearEditState();

        e.preventDefault();
    }

    //Clear All button event
    const clearAllItemsClick = function(e) {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Delete all from UI
        UICtrl.deleteAllItems();

          //Add calories
          const totalCalories = ItemCtrl.getTotalCalories();
          //show calories in UI
          UICtrl.showCalories(totalCalories);
  
          UICtrl.clearEditState();

          UICtrl.hideList();

        // e.preventDefault();
    }

    //Public function
    return {
        init: function() {
            //hide the edit state buttons
            UICtrl.clearEditState();

            //fetch items from data structure
            const items = ItemCtrl.getItems();

            //Check if any items
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                 //Populate list of items
                UICtrl.populateItemList(items);
            }

             //Add calories
             const totalCalories = ItemCtrl.getTotalCalories();

             //show calories in UI
             UICtrl.showCalories(totalCalories);

            //load event listner
            loadEventListner();

        }
    }

})(ItemCtrl, UICtrl);

App.init();