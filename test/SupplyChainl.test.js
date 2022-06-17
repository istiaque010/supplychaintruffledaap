const SupplyChain = artifacts.require("SupplyChain.sol")


contract('SupplyChain', async(accounts)=>{

        //members
        const supplier = accounts[0];
        const deliveryCompany = accounts[1];
        const customer = accounts[2];

        //orderr prams
        const title = 'books';
        const description = 'dictionary';

        //statuses
        const CREATED = 0;
        const DELIVERING = 1;
        const DELIVERED = 2;
        const ACCEPTED = 3;
        const DECLIENED = 4;


        //indexes
        const orderIndex = 0;


    it('1. Create ne order', async() => {

    const instance = await SupplyChain.deployed();

    

   await instance.createOrder(title, description, deliveryCompany, customer);
   const order = await instance.getOrder(orderIndex);
   
   console.log(order);

   asssert.equil(title, order[0], 'Title is not correct');
   asssert.equil(description, order[1], 'Description title is not correct');
   asssert.equil(supplier,  order[2], 'Supplier is not correct');
   asssert.equil(deliveryCompany, order[3], 'Delivery Compaany is not correct');
   asssert.equil(customer,  order[4], 'Customer is not correct');
   asssert.equil(CREATED,  order[5], 'Customer is not correct');
});


it('2. Start delivering order ', async() =>{

    const instance = await SupplyChain.deployed();


   await instance.startDeliveringOrder(orderIndex, {from:deliveryCompany});
   const order = await instance.getOrder(orderIndex);
   
   console.log(order);

   asssert.equil(DELIVERING, order[5], 'Status is not 1 (Delivering)');

});

it('3. Stop delivering order ', async() =>{

    const instance = await SupplyChain.deployed();


   await instance.stopDeliveringOrder(orderIndex, {from:deliveryCompany});
   const order = await instance.getOrder(orderIndex);
   
   console.log(order);

   asssert.equil(DELIVERED, order[5], 'Status is not 2 (Delivered)');

});

it('4. Customer accept order ', async() =>{

    const instance = await SupplyChain.deployed();


   await instance.acceptOrder(orderIndex, {from:customer});
   const order = await instance.getOrder(orderIndex);
   
   console.log(order);

   asssert.equil(ACCEPTED, order[5], 'Status 3 is not  (Accepted)');

});



it('5. Customer can\'t decline accepted order ', async() =>{

    const instance = await SupplyChain.deployed();


     try{

        await instance.getOrder(orderIndex);
     }catch(err){
        asssert.equil(err.message, order[5], 'Returned err: Exception while processing transaction revert', 'Expecter "revert" error');
     }

});

it('6. Customer can decline delivered order', async() => {

    const instance = await SupplyChain.deployed();

    const newOrderIndex=orderIndex+1;

   await instance.createOrder(title, description, deliveryCompany, customer);
   const order = await instance.getOrder(orderIndex);
   
   await instance.createOrder(title, description, deliveryCompany,customer);
   await instance.startDeliveringOrder(newOrderIndex, {from:deliveryCompany});
   await instance.stopDeliveringOrder(orderIndex, {from:deliveryCompany});
   await instance.declineOrder(orderIndex, {from:customer});

   await instance.getOrder(newOrderIndex);
   
   asssert.equal(DECLIENED, order[5], 'Order status is not Declined');

});


it('7. Orders length should be 2 ', async() =>{

    const instance = await SupplyChain.deployed();

     const ordersNumber = await instance.getOrdersLength.call();

     asssert.equal(2, ordersNumber, 'Orders number is not correct');

});

it('8. Customer should have 2 orders', async() =>{

    const instance = await SupplyChain.deployed();

     const ordersNumber = await instance.getSelfOrdersLength.call(customer);

     asssert.equal(2, ordersNumber, 'Customer Orders number is not correct');

});

it('9. Supplier should have 2 orders', async() =>{

    const instance = await SupplyChain.deployed();

     const ordersNumber = await instance.getSelfOrdersLength.call(supplier);

     asssert.equal(2, ordersNumber, 'Supplier Orders number is not correct');

});

it('10. Delivery Company should have 2 orders', async() =>{

    const instance = await SupplyChain.deployed();

     const ordersNumber = await instance.getSelfOrdersLength.call(customer);

     asssert.equal(1, ordersNumber, 'Delivery company Orders number is not correct');

});

it('6. Customer can decline delivered order', async() => {

    const instance = await SupplyChain.deployed();
    
    const order0Index = await instance.setOrders.call(customer,0);
    const order1Index = await instance.setOrders.call(customer,1);
   
   asssert.equal(0, order0Index, 'Incorerect 0 order index');
   asssert.equal(1, order0Index, 'Incorerect 1 order index');


});




});

