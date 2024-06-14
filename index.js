import fs from 'fs';
import readline from 'readline-sync';
import chalk from 'chalk';

const inventoryFile = './inventory.json';
const cart = [];

// Load inventory from file
function loadInventory() {
    try {
        const data = fs.readFileSync(inventoryFile);
        return JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Error reading inventory file.'));
        return [];
    }
}

// Save inventory to file
function saveInventory(inventory) {
    try {
        fs.writeFileSync(inventoryFile, JSON.stringify(inventory, null, 2));
        console.log(chalk.green('Inventory saved successfully!'));
    } catch (error) {
        console.error(chalk.red('Error writing to inventory file.'));
    }
}

// A user can create a new item
function addItem() {
    const inventory = loadInventory();
    const id = inventory.length ? inventory[inventory.length - 1].id + 1 : 1;
    const name = readline.question('Enter Funko Pop name: ');
    const priceInCents = readline.questionInt('Enter Funko Pop price (in cents): ');
    const inStock = readline.keyInYN('Is the Funko Pop in stock? ');
    const series = readline.question('Enter the series: ');

    const newItem = { id, name, priceInCents, inStock, series };
    inventory.push(newItem);
    saveInventory(inventory);
    console.log(chalk.green('Funko Pop added successfully!'));
}

// A user can see a list of all the items
function listItems() {
    const inventory = loadInventory();
    inventory.forEach(item => {
        console.log(`${item.id}: ${item.name} - $${(item.priceInCents / 100).toFixed(2)} [Series: ${item.series}]`);
    });
}

// A user can see the details of one item
function viewItem(id) {
    const inventory = loadInventory();
    const item = inventory.find(i => i.id === id);
    if (item) {
        console.log(JSON.stringify(item, null, 2));
    } else {
        console.log(chalk.red('Funko Pop not found'));
    }
}

// A user can delete an item
function deleteItem(id) {
    let inventory = loadInventory();
    inventory = inventory.filter(item => item.id !== id);
    saveInventory(inventory);
    console.log(chalk.green('Funko Pop deleted successfully!'));
}

// A user can update an item
function updateItem(id) {
    const inventory = loadInventory();
    const item = inventory.find(i => i.id === id);
    if (item) {
        item.name = readline.question(`Enter new name (${item.name}): `) || item.name;
        item.priceInCents = readline.questionInt(`Enter new price (${item.priceInCents}): `) || item.priceInCents;
        item.inStock = readline.keyInYN(`Is the Funko Pop in stock? (${item.inStock}): `) || item.inStock;
        item.series = readline.question(`Enter new series (${item.series}): `) || item.series;
        saveInventory(inventory);
        console.log(chalk.green('Funko Pop updated successfully!'));
    } else {
        console.log(chalk.red('Funko Pop not found'));
    }
}

// Add a cart function where a user can add items to the shopping cart and see the total price and total number of each item
function addToCart(id) {
    const inventory = loadInventory();
    const item = inventory.find(i => i.id === id);
    if (item) {
        cart.push(item);
        console.log(chalk.green('Funko Pop added to cart!'));
    } else {
        console.log(chalk.red('Funko Pop not found'));
    }
}

// A user can see the details of the cart
function viewCart() {
    if (cart.length === 0) {
        console.log(chalk.yellow('Cart is empty'));
        return;
    }
    cart.forEach(item => {
        console.log(`${item.id}: ${item.name} - $${(item.priceInCents / 100).toFixed(2)} [Series: ${item.series}]`);
    });
    const total = cart.reduce((acc, item) => acc + item.priceInCents, 0);
    console.log(chalk.green(`Total: $${(total / 100).toFixed(2)}`));
}

// Add a cancel cart function that empties the shopping cart
function cancelCart() {
    cart.length = 0;
    console.log(chalk.green('Cart emptied successfully!'));
}

// Main menu
function mainMenu() {
    while (true) {
        console.log(chalk.green('\nWelcome to the Funko Pops Inventory System!'));
        console.log('1. Create new item');
        console.log('2. List items');
        console.log('3. See details of one item');
        console.log('4. Delete item');
        console.log('5. Update item');
        console.log('6. Add items to cart');
        console.log('7. View cart');
        console.log('8. Empty cart');
        console.log('9. Exit');

        const choice = readline.question('Please select an option: ');

        switch (choice) {
            case '1':
                addItem();
                break;
            case '2':
                listItems();
                break;
            case '3':
                const viewId = readline.questionInt('Enter the ID of the item to view: ');
                viewItem(viewId);
                break;
            case '4':
                const deleteId = readline.questionInt('Enter the ID of the item to delete: ');
                deleteItem(deleteId);
                break;
            case '5':
                const updateId = readline.questionInt('Enter the ID of the item to update: ');
                updateItem(updateId);
                break;
            case '6':
                const addToCartId = readline.questionInt('Enter the ID of the item to add to cart: ');
                addToCart(addToCartId);
                break;
            case '7':
                viewCart();
                break;
            case '8':
                cancelCart();
                break;
            case '9':
                console.log(chalk.blue('Goodbye!'));
                process.exit(0);
                break;
            default:
                console.log(chalk.red('Invalid option, please try again.'));
        }
    }
}

// Start the application
mainMenu();

// Export functions for testing
export {
    loadInventory,
    saveInventory,
    addItem,
    listItems,
    viewItem,
    deleteItem,
    updateItem,
    addToCart,
    viewCart,
    cancelCart
};
