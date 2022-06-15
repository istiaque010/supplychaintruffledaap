// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SypplyChain{
 
    enum Status{Created, Delivering, Delivered, Accepted, Decliened}
 
    //Order[] public orders;
    Order[]  orders;

    mapping(address => uint256[]) public selfOrders;
 
    struct Order{
        string  title;
        string  description;
        address supplier;
        address deliveryCompany;
        address customer;
        Status status;
    }


    event OrderCreated(
        uint256 index,
        address indexed deliveryCompany,
        address indexed customer

    );

    event OrderDelivering(
        uint256 index,
        address indexed deliveryCompany,
        address indexed customer

    );

    event OrderDelivered(
        uint256 index,
        address indexed deliveryCompany,
        address indexed customer

    );

    event OrderAccepted(
        uint256 index,
        address indexed supplier,
        address indexed deliveryCompany

    );

     event OrderDecliened(
        uint256 index,
        address indexed supplier,
        address indexed deliveryCompany

    );

    
 
    modifier onlyOrderDeliveringCompany(uint256 _index){
        require(orders[_index].deliveryCompany == msg.sender);
        _;
    }
 
    modifier orderCreated(uint256 _index)
    {
        require(orders[_index].status == Status.Created);
        _;
    }
 
    modifier orderDelivering(uint256 _index)
    {
        require(orders[_index].status == Status.Delivering);
        _;
    }
 
     modifier orderDelivered(uint256 _index)
    {
        require(orders[_index].status == Status.Delivered);
        _;
    }
 
    modifier onlyCustomer(uint256 _index)
    {
      require(orders[_index].customer == msg.sender);
        _;
    }



    function getOrderLength() public view returns(uint256){
        return orders.length;

    }


    function getOrder(uint256 _index) public view returns (string memory, string memory, address, address, address, Status){

        Order memory order = orders[_index];

        return(order.title, order.description, order.supplier, order.deliveryCompany, order.customer, order.status);

    }

    function getSelfOrdersLength(address _address) public view returns(uint256){
        return selfOrders[_address].length;

    }
 
    function createOrder(string memory _title, string memory _description, address _deliveryCompany, address _customer) public {
         
         Order memory order = Order ({
 
                    title: _title,
                    description: _description,
                    supplier: msg.sender,
                    deliveryCompany: _deliveryCompany,
                    customer: _customer,
                    status: Status.Created
         });
       
         //uint256 index = orders.length+1;
         //orders[index]= order;
         //return index;
         uint256 index = orders.length;
         emit OrderCreated(index, _deliveryCompany, _customer);

          orders.push(order);

          selfOrders[msg.sender].push(index);
          selfOrders[_deliveryCompany].push(index);
          selfOrders[_customer].push(index);
    }

 
 
    function startDeliveringOrder(uint256 _index) public onlyOrderDeliveringCompany(_index) orderCreated(_index) {
 
        Order storage order = orders[_index];
        emit OrderDelivering(_index, order.supplier, order.customer);
        order.status = Status.Delivering;
 
    }
 
    function stopDeliveringOrder(uint256 _index) public onlyOrderDeliveringCompany(_index) orderDelivering(_index){
 
        Order storage order = orders[_index];
          emit OrderDelivered(_index, order.supplier, order.customer);
          order.status = Status.Delivered;
 
    }
 
    function acceptOrder(uint256 _index) public onlyCustomer(_index) orderDelivered(_index){
         Order storage order = orders[_index];
        emit OrderAccepted(_index, order.supplier, order.deliveryCompany);
        orders[_index].status = Status.Accepted;
 
    }
 
    function declineOrder(uint256 _index) public onlyCustomer(_index) orderDelivered(_index){
          Order storage order = orders[_index];
        emit OrderDecliened(_index, order.supplier, order.deliveryCompany);
        orders[_index].status = Status.Decliened;
 
    }
 
 
}
