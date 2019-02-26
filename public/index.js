function viewDashboard(){
const dashboardHtml = $(
    `<h2>Dashboard</h2>
    <ul id="buttons_list">
        <li id="add_bill">Add bill</li>
        <li id="settle_up">Settle Up</li>
    </ul>
    <section id="bills_list">
        <ul id = "lent_list"></ul>
        <ul id = "borrowed_list"></ul>
    </section>`
);
$("#dashboard").on("click", function(event){
    event.preventDefault();
    $(main).html(dashboardHtml);
    displayBills();
});
}

function allExpenses() {
    $("#all_expenses").on("click", function(event) {
        let html =`<h2>All Expenses</h2>
                    <ul id="buttons_list">
                    <li id="add_bill">Add bill</li>
                    <li id="settle_up">Settle Up</li>
                    </ul>`;
        /*for(let i=0; i< bills.length; i++) {
            html += `<li>${bills[i].date}    ${}</li>`
        }*/
        bills.forEach(bill => {
            html += `<li> ${bill.date} ${bill.description}  `;
            if(bill.lender_email === users[0].email) {
                html += `You paid:${bill.amount} You lent ${bill.borrower_name}: $${bill.share_amount}</li>`
            }
            else {
                html += `${bill.lender_name} paid:${bill.amount} ${bill.lender_name} lent you: $${bill.share_amount}</li>`
            }
        })
        $(main).html(html);
    });
}
function viewRecentActivity(){
    let html = "<ul>";
    bills.forEach(bill => {
        if(bill.person_added === users[0].name || bill.lender_name === users[0].name || bill.borrower_name === users[0].name) {
            html += `<li> ${bill.person_added} added ${bill.description}<br />`;
            if(bill.lender_name === users[0].name) {
                html += `${bill.borrower_name} owes you $${bill.share_amount}</li>`;
            }
            else {
                html += `You owe ${bill.lender_name} $${bill.share_amount}</li>`;
            }
        }
    });
    html += "</ul>";
    $("#recent").on("click", function(event) {
        event.preventDefault();
        $(main).html(html)
    });
}
function settleUp() {
    $("#main").on("click","#settle_up", function(event) {
        event.preventDefault();
        let html = `<form id="settle_form"> You paid <select>`;
        let i = 0;
        users[0].friendlist.forEach(friend => {
            if(i === 0) {
                html += `<option value = ${i} selected>${friend.name}</option>`;
            }
            else {
                html += `<option value = ${i}>${friend.name}</option>`;
            }
            i++;
        });
        html += `</select>
                    <label for="js_amount_paid">$</label>
                    <input type="number" step="0.01" min=0.01 name="amount" id="js-amount" required/>
                    <input type="button" value="Cancel" id="js-cancel" />
                    <input type="submit" value="Save" />`;
        $(main).html(html);
    });

}

function settleFormOperations() {
    $("#main").on("submit","#settle_form", function(event) {
        event.preventDefault();
        document.getElementById("js-amount").value = "";
        redirectToDashboard();
    });
    $("#main").on("click", "#js-cancel", function(event) {
        event.preventDefault();
        redirectToDashboard();
    });
}

function addFriend() {
$("#add_friend").on("submit", function(event){
    event.preventDefault();
    let fname = document.getElementById("name").value;
    let femail = document.getElementById("friend_email").value;
    users[0].friendlist.push({name:fname, email:femail});
    console.log(users[0].friendlist);
    document.getElementById("name").value="";
    document.getElementById("friend_email").value = "";
    displayFriendList();
});
}

function addBill() {
    const addBillHtml = $(
        `<form id="js-add-bill">
            <fieldset>
                <legend>Add bill</legend>
                <label for="name">Choose Friend</label>
                <select id="js-fname" name="name" onchange="updatePersonPaid(this.value)"></select>
                <label for="description">Description</label>
                <input type="text" name="description" id="js-description" required/>
                <label for="amount">$</label>
                <input type="number" step="0.01" min=0.01 name="amount" id="js-amount" required/>
                <label for="person-paid">Paid By
                <select id="js-person-paid" name="person-paid"></select> and split equally
                </label>
                <input type="button" value="Cancel" id="js-cancel" />
                <input type="submit" value="Save" />
            </fieldset>
        </form>`
    );

    $("#main").on("click","#add_bill", function(event){
        event.preventDefault();
        $(main).html(addBillHtml);
        updateOptions();
    });

}

function updateOptions() {
    let html = "";
    for(let i=0; i< users[0].friendlist.length; i++) {
        if(i===0) {
            html += `<option value=${i} selected>${users[0].friendlist[i].name}</option>`;
        }
        else {
            html += `<option value=${i}>${users[0].friendlist[i].name}</option>`;
        }
    }
    $("#js-fname").html(html);
    $("#js-person-paid").html(`<option value=${users[0].email} selected>You</option>
                                <option value=${users[0].friendlist[0].email}>${users[0].friendlist[0].name}</option>`);
}

function updatePersonPaid(friend_id) {
    $("#js-person-paid").html(`<option value=${users[0].email} selected>You</option>
    <option value=${users[0].friendlist[friend_id].email}>${users[0].friendlist[friend_id].name}</option>`);
}

function handleAddBill() {
    $("#main").on("submit","#js-add-bill", function(event) {
        event.preventDefault();
        console.log("insidehandleaddBill");
        let friend_email = users[0].friendlist[document.getElementById("js-fname").value].email;
        let user_email = users[0].email;
        let description = document.getElementById("js-description").value;
        let amount = parseFloat(document.getElementById("js-amount").value);
        let share_amount = amount/2;
        let personpaid = document.getElementById("js-person-paid").value;
        //console.log(`${friend_email},${user_email},${description},${amount},${personpaid}`);
        let bill = {lender_email:personpaid, description: description, amount:amount, share_amount:share_amount, date:Date.now, paid:false, deleted:false}
        //console.log(bill);
        if(bill.lender_email === friend_email){
            bill.borrower_email = user_email;
            bill.borrower_name = users[0].name;
            bill.lender_name = users[0].friendlist[document.getElementById("js-fname").value].name;
        }
        else {
            bill.borrower_email = friend_email;
            bill.borrower_name = users[0].friendlist[document.getElementById("js-fname").value].name;
            bill.lender_name = users[0].name;
        }
        bills.push(bill);
        document.getElementById("js-description").value = document.getElementById("js-amount").value = "";
        /*$(main).html(`Lender: ${bill.lender}<br/>
                        Borrower:${bill.borrower}<br/>
                        Amount:${bill.amount}<br/>
                        Description:${bill.description}<br/>
                        Date:${bill.date}<br/>`);*/
        redirectToDashboard();
    });

    $("#main").on("click", "#js-cancel", function(event) {
        event.preventDefault();
        redirectToDashboard();
    });
}

function redirectToDashboard() {
    const dashboardHtml = $(
        `<h2>Dashboard</h2>
        <ul id="buttons_list">
            <li id="add_bill">Add bill</li>
            <li id="settle_up">Settle Up</li>
        </ul>
        <section id="bills_list">
            <ul id = "lent_list"></ul>
            <ul id = "borrowed_list"></ul>
        </section>`
    );
    $(main).html(dashboardHtml);
    displayBills();
}

function filterLentBills(bill) {
    console.log(`${bill.lender_email} === ${users[0].email} && ${bill.paid} === ${false} && ${bill.deleted} === ${false}`);
    if(bill.lender_email === users[0].email && bill.paid === false && bill.deleted === false) {
        console.log("inside if");
        return true;
    }
    else {
        return false;
    }
}

function filterBorrowedBills(bill) {
    if(bill.borrower_email === users[0].email && bill.paid === false && bill.deleted === false) {
        return true;
    }
    else {
        return false;
    }
}

function displayBills() {
    //console.log(users[0].email);
    //console.log(bills[0].lender_email === users[0].email);
    let user_lent_bills = bills.filter(filterLentBills);
    let user_borrowed_bills = bills.filter(filterBorrowedBills);
    let bills_obj = {};
    let lent_html ="";
    let borrowed_html = "";
    //console.log("inside display bills");
    //console.log(user_lent_bills);
    //console.log(user_borrowed_bills);
    for(let i=0; i<user_lent_bills.length; i++) {
        //console.log("inside loop 1");
        if(bills_obj[user_lent_bills[i].borrower_name] ) {
            bills_obj[user_lent_bills[i].borrower_name] -= user_lent_bills[i].share_amount;
        }
        else {
            bills_obj[user_lent_bills[i].borrower_name] = -(user_lent_bills[i].share_amount);
        }
    }
    //console.log(bills_obj);
    for(let i=0;i<user_borrowed_bills.length; i++) {
        if(bills_obj[user_borrowed_bills[i].lender_name]) {
            bills_obj[user_borrowed_bills[i].lender_name] += user_borrowed_bills[i].share_amount;
        }
        else {
            bills_obj[user_borrowed_bills[i].lender_name] = user_borrowed_bills[i].share_amount;
        }
    }
    //console.log(bills_obj);
    Object.keys(bills_obj).forEach(key => {
        if(bills_obj[key] < 0) {
            lent_html += `<li>${key} owes you $${Math.abs(bills_obj[key])}`; 
        }
        else if(bills_obj[key] > 0) {
            borrowed_html += `<li>You owe ${key} $${bills_obj[key]}`;
        }
    });
    //console.log("After html loop");
    $(lent_list).html(lent_html);
    $(borrowed_list).html(borrowed_html);
}

function displayFriendList() {
    let friendListHtml = "";
    for(let i=0; i<users[0].friendlist.length; i++) {
        friendListHtml += `<li>${users[0].friendlist[i].name}</li>`;
    }
    $(friend_list).html(friendListHtml);
}

function handleSplitter(){
    let user = users[0];
    //console.log(user);
    displayFriendList();
    displayBills();
    viewDashboard();
    allExpenses();
    addBill();
    addFriend();
    handleAddBill();
    viewRecentActivity();
    settleFormOperations();
    settleUp();
}

$(handleSplitter);