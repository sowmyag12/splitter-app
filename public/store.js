const users =[
    {
        name:"aaaa",
        email:"aaa@xyz.com",
        id:0000001,
        password:"sasdsdvcszfsz",
        friendlist:[
            {name:"bbbb",email:"bbb@abc.com"},
            {name:"cccc", email:"cccc@xyz.com"}],
    },
    {
        name:"bbbb",
        email:"bbb@abc.com",
        id:0000002,
        password:"adasfsdfvz",
        friendlist:[{name:"aaaa",email:"aaa@xyz.com"}, {name:"cccc", email:"cccc@xyz.com"}],
    }
];

const bills = [{
    lender_email: "bbb@abc.com", lender_name:"bbbb", borrower_name:"aaaa", borrower_email: "aaa@xyz.com", description:"lunch", amount:20, share_amount:10, date:new Date('2019-01-17T03:24:00'), paid:false, deleted:false, person_added: "aaaa"},
    {lender_email:"aaa@xyz.com", lender_name:"aaaa", borrower_name:"cccc", borrower_email:"cccc@xyz.com", description: "dinner", amount:15, share_amount:7.5, date:new Date('2019-02-19T03:24:00'), paid:false, deleted:false, person_added: "aaaa"
}];