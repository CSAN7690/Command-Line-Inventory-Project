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

// Command-line interface
const command = process.argv[2];
const arg = parseInt(process.argv[3], 10);

switch (command) {
    case 'add':
        addItem();  // A user can create a new item
        break;
    case 'list':
        listItems();  // A user can see a list of all the items
        break;
    case 'view':
        viewItem(arg);  // A user can see the details of one item
        break;
    case 'delete':
        deleteItem(arg);  // A user can delete an item
        break;
    case 'update':
        updateItem(arg);  // A user can update an item
        break;
    case 'cart':
        const cartCommand = process.argv[3];
        const cartArg = parseInt(process.argv[4], 10);
        if (cartCommand === 'add') {
            addToCart(cartArg);  // Add items to the shopping cart
        } else if (cartCommand === 'view') {
            viewCart();  // See the total price and total number of each item in the cart
        } else if (cartCommand === 'cancel') {
            cancelCart();  // Empty the shopping cart
        }
        break;
    default:
        console.log(chalk.red('Invalid command'));
}

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
