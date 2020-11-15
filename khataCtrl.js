//1st Module Budget Controller..
var budgetController = (function(){
    
    //We will create constructors in order to store the income and expenses..
    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }
    
    var Expenses = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    //Here we have created an object which will keep hold of all the data that we are going to input and will store that inside the arrays..
    var data = {
        allItems : {
            exp: [],
            inc: []
        } ,
        totals : {
            exp: 0,
            inc: 0
        },
        budget : 0,
        percentage: -1
    };
    
    var calculateTotals = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            sum+=curr.value;
        });
        data.totals[type] = sum;
    }
    
    return{
        addItem: function(type, desp, val){
            
            var ID, newItem;
            
            //[2,4,6,7,8]-> Here the new ID to be added should be 9
            //So ID = last ID +1;
            //Create a new ID;
            if(data.allItems[type].length >= 1){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else{
                ID = 0;
            }
            //Create a new item based on inc or dec values..
            if(type === 'exp'){
                newItem = new Expenses(ID, desp, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, desp, val);
            }
            
            //Push the newItem into our dataStructure..
            data.allItems[type].push(newItem);
            
            //return the new item..
            return newItem;
        } ,
        
        deleteItem: function(type, id){
            var ids, index;
            
            ids = data.allItems[type].map(function(current){
                return  current.id;
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        
        calculateBudget: function(){
            
            //calculate total income and expenses..
            calculateTotals('exp');
            calculateTotals('inc');
            
            //calculate the budget income and expenses..
            data.budget = data.totals.inc - data.totals.exp;
            
            //calculate the percentage of income that we spend..
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            }else{
                data.percentage = -1;
            }
        },
        
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }  
        },
        
        testing: function(){
            console.log(data);
        }
    };
    
})();

//2nd module UI Controller..
var UIController = (function(){
    
    //Inorder to prevent the bugs which could possibly occur in our code due to the change in names of .add_type, .in2, .in3, we shall create a private object where we give them different names so that no one can manipulate them globally..
    
    var DOMstrings = {
        inputType : '.add_type',
        inputDescription: '.in2',
        inputValue : '.in3',
        inputButton: '.button1',
        incomeList: '.income_list',
        expenseList: '.expenses_list',
        budgetLabel: '#number1',
        incomeLabel: '.budget_income_value',
        expenseLabel: '.budget_expense_value',
        percentageLabel: '.budget_expense_ptg',
        container: '.container_clearfix',
        yearLabel: '.year'
    };
    
    var formatNumber = function(num, type){
        var int, dec, numSplit, sign;
        num = Math.abs(num);
        num = num.toFixed(2);
            
        numSplit = num.split('.');
        console.log(numSplit[0],numSplit[1]);
        int = numSplit[0];
        if(int.length > 3){
            int = int.substr(0,int.length -3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];
        if(type === 'exp'){ type = '-';}
        else{ type = '+';}
        var x = type + ' ' + int +'.'+dec;
        console.log(x,num,int,dec);
        return type + ' ' + int + '.' + dec;
            
    };
    
    return{  
        getInput: function(){
            return{
                type : document.querySelector(DOMstrings.inputType).value,  //this will either be inc or dec..
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type){
            var html, newHtml, element, id1;
            //Create HTML string with placeholder text..
            
            if(type === 'inc'){
                element = DOMstrings.incomeList;
                //console.log(id1);
                html = '<div class="item_clearfix" id="inc-%id%"><div class="item_description" id="txt1">%description%</div><div class="item_value" id="val1">%value%</div><button class="btns" id="btn1">x</button></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expenseList;
                
                html = '<div class="item_clearfix" id="exp-%id%"><div class="item_description" id="txt2">%description%</div><div class="item_value" id="val2">%value%</div><button class="btns" id="btn2">x</button></div>';
                
            }
            
            //Replace the placeHolder text with some actual data..
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            //Insert the HTML into the DOM..
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        addDate: function(){
            var now, year, month, months;
            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.yearLabel).textContent = months[month] + ' ' + year;
        },
        
        deleteListItem: function(itemID){
            var ele = document.getElementById(itemID);
            ele.parentNode.removeChild(ele);
        },
        
        clearFields: function(){
            var fields, fieldArr;
            
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            fieldArr = Array.prototype.slice.call(fields);
            fieldArr.forEach(function(current, index, array){
                current.value = ""; 
            });
            
            fieldArr[0].focus();
        },
        
        displayBudget: function(obj){
            var opt;
            if(obj.totalInc >= obj.totalExp){ opt = 'inc';}
            else{ opt = 'exp';}
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, opt);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        
        getDOMstrings: function(){
            return DOMstrings;  
        }
    };
    
})();

//3rd module APP Controller..
var controller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function(){
    
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);

        //We want to perform the same functionalities if we press ENTER..
        document.addEventListener('keypress', function(event){

            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });
        
        //Event Listener for deleting a field..
        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        
    }
    
    var updateBudget = function(){
        
        //1. Calculate the budget..
        budgetCtrl.calculateBudget();
        
        //2. Return the budget to BudgetController..
        var budget = budgetCtrl.getBudget();
        //3.Display the budget on the UI..
        UICtrl.displayBudget(budget);
    }
    
    var ctrlAddItem = function(){
        var input, newItem;
        //1. Get the filled input data..
        
        input = UICtrl.getInput();
        
        //2. Add the item to the budget Controller..
        
        if(input.description !== '' && !isNaN(input.value) && input.value>0){
            
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add the item to the UI..

            UICtrl.addListItem(newItem, input.type);

            //4.Clear the fields..

            UICtrl.clearFields();

            //5. Call the updateBudget function..
            updateBudget();
            
        }
    };
    
    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        //We want to know the first field from where its been fired..    
        //console.log(event.target.parentNode.id);
        itemID = event.target.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            //1.Delete an item from the data structure..
            
            budgetCtrl.deleteItem(type, ID);
            
            //2. Delete an item from the UI..
            
            UICtrl.deleteListItem(itemID);
            
            //3. Update and show the new budget..
            
            updateBudget();
        }
    };
    
    return{
        init: function(){
            console.log("Execution has started..");
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
            UICtrl.addDate();
        }  
    };
    
})(budgetController, UIController);

controller.init();