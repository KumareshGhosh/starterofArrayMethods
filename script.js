'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// Data
const account1 = {
  owner: 'Soumendu Nandi',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Kumaresh Ghosh ',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Abhijit Mallick',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Debjit Dutta',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Dsiplay movements
const showMovement = function (movement, sort = false) {
  containerMovements.innerHTML = ''; //clearing existing data firsts
  //Innerhtml works same as query selector, it gives entire html elemets together

  const movs = sort ? movement.slice().sort((a, b) => a - b) : movement;
  //used slice to make a copy of original array as sorting mutate
  //the original array
  movs.forEach(function (val, i) {
    const type = val > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div 
    class="movements">
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${val}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    //above method used to attach the html elements with the movememnt clss
    //takes 2 arguments sequentially: position, html
    // console.log(containerMovements.innerHTML);
  });
};

//DOM element using to show the main balance after transaction
const displayprincipleBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  //Balance properties gets created only after clicking the
  //buttons in DOM
  labelBalance.textContent = `${acc.balance}€`;
};

//Displaing summary
const displayTransactionSummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const outgoing = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  //intereset: per deposit * 0.2 percent
  const intereset = acc.movements
    .filter(mov => mov > 0)
    .map(value => (value * acc.interestRate) / 100)
    .filter((amount, i, arr) => {
      //console.log(arr); //to check which values are eliminating
      return amount >= 1;
    }) //only add intereset if value>1 euro
    .reduce((acc, int) => acc + int, 0);
  labelSumIn.textContent = `${income}€`;
  labelSumOut.textContent = `${Math.abs(outgoing)}€`;
  labelSumInterest.textContent = `${Math.round(intereset)}€`;
};

//DOM element : Computing username
const createUserID = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner //creates username property
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join(''); //creating new element username
    //to store the usernames
  });
};
createUserID(accounts);
//console.log(accounts);
//display changes TO USE inside BELOW DOM'S
const updateUI = function (acc) {
  //Display balance
  displayprincipleBalance(acc);
  //display movements
  showMovement(acc.movements);
  //display summary
  displayTransactionSummary(acc);
};

//Event handler functions(login button)
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); //prevent form from submitting
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  //console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //DISPLAY UI AND WELCOME MESSAGE
    //UI
    containerApp.style.opacity = 100;
    //welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    } 💸 `;
    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //to remove the cursor when just logged in
    updateUI(currentAccount);
  }
});
//Event handler functions(transfer button)

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); //prevent form from reload
  const transferAmount = inputTransferAmount.value;
  const receiverBank = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(transferAmount, receiverBank);
  if (
    transferAmount > 0 &&
    receiverBank &&
    transferAmount <= currentAccount.balance &&
    receiverBank?.username !== currentAccount.username //not possible to send money to own account
  ) {
    currentAccount.movements.push(-transferAmount);
    receiverBank.movements.push(+transferAmount);
    updateUI(currentAccount);
    console.log('Transaction Successfull 👻');
  }

  inputTransferAmount.value = inputTransferTo.value = ''; //clear the input field
});

//Event handler functions(request loan button)
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //some method to check highest movement > amount *0.1 or not,similar as include method with condition
    currentAccount.movements.push(amount); //pushed the loan amount
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';

  console.log(amount);
});

//Event handler functions(close account button)
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      //finding the index of the current account
      acc => acc.username === currentAccount.username
    );
    //deletion of the current account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
});

//Event handler functions(sorting button)
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  //if not sorted then sort
  showMovement(currentAccount.movements, !sorted);
  sorted = !sorted; //back to original so that we can sort again
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*Reduce method
//accumulator -> SNOWBALL
const balance = movements.reduce(function (acc, mov, i) {
  console.log(`Movement ${i} : ${acc}`); //step by transacrion
  return acc + mov;
}, 0); //base value of accumulator assigned=0
console.log(balance);

//same using for of loop
let balance2 = 0;
//everytime we have to take a variable outside for for of loop
//which is good for only one line of loop
for (const bal of movements) balance2 += bal;
console.log(balance2);

//Reduce method with arrow function
const accAgain = movements.reduce((acc, mov) => acc + mov);
console.log(accAgain);

//print max or min value using reduce method
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc; //acc value is not changing
  else return mov; //new acc value changing and again looping with new mov value
});
console.log(max);
*/
/*filter method

const deposits = movements.filter(function (mov) {
  //takes similar
  //formation like foreach: element.index,whole array
  return mov > 0; //only picking values >0
});
//console.log(movements);
console.log(deposits);
//Same using for of loop
const empty = [];
for (const mov of movements) if (mov > 0) empty.push(mov);
console.log(empty);

//for withdral using filter method
const withdraw = movements.filter(mov => mov < 0);
console.log(withdraw);
//for withdraw using for of loop
const withdrawAgain = [];
for (const mov of movements) if (mov < 0) withdrawAgain.push(mov);
console.log(withdrawAgain);
*/
/////////////////////////////////////////////////
/*very Important for SLICE
let arr = ['a', 'b', 'c', 'd', 'e'];
console.log(arr.slice(1, 3)); //[b,c] //if both positive,1st position
//gets printed last position no print.
console.log(arr.slice(1, -2)); //[b,c] :if 1st positive ,last negative
// both position element
//will get printed between both numbers
console.log(arr.slice(-3, -1)); //[b,c,d]://if both negative,
//1st element no print,2nd element print*Just opposite of both positive
console.log(arr.slice(3, 1)); //no element print(first>last)
console.log(arr.slice(-2, 4)); //[d],no end element print,only middle
//elements gets printed*only if both positions crossed their path
console.log(arr.slice(-2, -4)); //no elemtn print(first<last(Oppsite of positive))
//if first element < last element: nothing gets print
console.log(arr.slice(3)); //[d,e]:print rest elements from 3rd position
//including 3rd position,starts extracting from 3rd
console.log(arr.slice(-2)); //[d,e]:print elements from the last
//except -2th positioned element,starts extracting from -2nd
console.log(arr); //NO MUTATION OF ORIGINAL ARRAY
// setTimeout(() => {
//   let set = [1, 2, 3, 4, 4, 2, 1, 10];
//   for (let i = 0; i < set.length; i++) {
//     console.log(`this is the ${i + 1}th time it happened again : ${set[i]}`);
//   }
// }, 3 * 1000);

//SPLICE method

console.log(arr.splice(1, 2)); //extracting from position 1 to 2
//Mutated original array unlike slice method
console.log(arr); //Mutation of original array


//REVERSE METHOD
const arr1 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr1.reverse());
console.log(arr1); //Mutation of original array

//CONCAT METHOD
const letters = arr.concat(arr1);
console.log(letters);
console.log([...arr, ...arr1]); //Same output different method
//as used destructuring here.

//JOIN METHOD
console.log(letters.join('-')); //joined with '-' symbol
*/
/*AT METHOD

const arr = [12, 14, 32, 54];
//traditional way to get element
console.log(arr[0]);
//using AT method
console.log(arr.at(0));
//traditional way to get last element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
//using AT method
console.log(arr.at(-1)); //Useful feature of AT
//Same worked for string
console.log('Kumaresh'.at(0));
console.log('Kumaresh'.at(-1));
*/
/*forof loop and foreach method difference
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log('-- ForOf --');
//Using for of loop
for (const [i, movement] of movements.entries()) {
  //Order: Index,Elements
  if (movement > 0)
    console.log(`Movement ${i + 1}: You have deposited ${movement}`);
  else
    console.log(`Movement ${i + 1}: You have withdrawn ${Math.abs(movement)}`); //abs: absolute value gives positive values
}

console.log('-- FOREACH --');
//Using for each loop
movements.forEach(function (movement, i, arr) {
  //Order: Elements,index,whole array
  //higher order function: Foreach
  if (movement > 0) {
    console.log(` Movement ${i + 1}: You have deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You have withdran ${Math.abs(movement)}`);
  }
});
*/
/*For each method in practice in Maps,sets,arrays
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
//ForEach with MAP
currencies.forEach(function (value, key, map) {
  //similar to array, callback functions argument order:
  //value,key,whole map
  console.log(`The fullform of ${key} is ${value} `);
  console.log(map);
});

//Foreach with SET
const concCheck = new Set(['USD', 'GBP', 'USD', 'GBP', 'USD', 'EUR']);
console.log(concCheck);
concCheck.forEach(function (value, key, set) {
  console.log(`${key}: ${value}`); //for SET ,key=value casue sets
  //dosen't have key, only has values.

  console.log(`${set}`);
});
*/
/*Challenge 1: forEach


const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];
const dogsJulia1 = [9, 16, 6, 8, 3];
const dogsKate1 = [10, 5, 6, 1, 4];

const checkDogs = function (arr1, arr2) {
  //task 1:removed cats
  const copyJulia = arr1.slice(1, -2);
  //task 2:adding two arrays
  const total = copyJulia.concat(arr2);
  //task 3:checking and printing dogs and puppies
  total.forEach(function (val, i) {
    const type =
      val >= 3
        ? `Dog number ${i + 1} is an adult, and is ${val} years old.`
        : `Dog number ${i + 1} is still a puppy 🐶.`;
    console.log(type);
  });
};
//task 4:
console.log('--Test data 1--');
checkDogs(dogsJulia, dogsKate);
console.log('--Test data 2--');
checkDogs(dogsJulia1, dogsKate1);
*/
/*Map method

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurotoUSD = 1.1;
const move = [];
//Using normal forOf loop
for (const movementsUSD of movements) {
  move.push(movementsUSD * eurotoUSD);
}
// console.log(movements);
//console.log(move);

//Using Map method

const maplearning = movements.map(function (mov) {
  //Takes same argument order as forEach loop
  return mov * eurotoUSD;
});
//console.log(maplearning);

//same using Arrow funciton
const arrow = movements.map(mov => mov * eurotoUSD);
console.log(arrow);

//String print by Map method with arrow type callback function
const movementDescription = movements.map(
  (val, i) =>
    `Movement ${i + 1}: You have ${
      val > 0 ? 'deposited' : 'withdrawn'
    } ${Math.abs(val)}`
);
console.log(movementDescription);

//String print by forEach method with arrow type callback function
movements.forEach((val, i) =>
  console.log(
    `Movement ${i + 1}: You have ${
      val > 0 ? 'deposited' : 'withdrawn'
    } ${Math.abs(val)}`
  )
);
*/

/*Challenge 2:using map,filter and reduce one by one
const calcAverageHumanAge = function (ages) {
  const humanAge = [];
  //task 1:changed to human age
  ages.map(age =>
    age <= 2 ? humanAge.push(age * 2) : humanAge.push(16 + age * 4)
  );
  //task 2://log only above 18 years age
  const adults = humanAge.filter(function (age) {
    return age >= 18; //log all values > 18 only
  });
  console.log(adults); //atleast 18 years old only
  //console.log(humanAge);
  //task 3:Calc average of adults array
  // const average = adults.reduce((acc, avAge) => acc + avAge, 0) / adults.length;
  // console.log(average);
  const average = adults.reduce(
    //Another way of producing average using array parameter
    (acc, avAge, i, arr) => acc + avAge / arr.length,
    0
  );
  console.log(average);
};

//additional
//Data transformation  methods with chaining(Chaining methods):
//step 1:filtering to make new array of deposit/withdraw
//step 2:Map method to change amounts to USDT and store the value in a array again
//step 3:reduce the amount by sum ,reduce dont produce a array,only value.
const eurotoUSD = 1.1;
const deposit = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurotoUSD)
  .reduce((acc, mov) => acc + mov, 0);
console.log(deposit);
*/
/*challenge 3:same as challenge 2 with method chaining
const calcAverageHumanAge = ages =>
  ages
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, avAge, i, arr) => acc + avAge / arr.length, 0);
const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
console.log(avg1, avg2);
*/

/*Find method
//only returns the first elemet when condition is true
//where in filter method we get all the elements
const f = movements.find(move => move < 0);
console.log(f);
console.log(accounts);

//real usecase : find all the account details from the name
//Can fetch object details from a single object propperties
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

//same using forOf loop:
for (const real of accounts) {
  if ((real.owner = 'Jessica Davis')) console.log(real);
}

//Findindex method:
const fin = accounts.findIndex(acc => acc.username === 'am');
console.log(fin);
*/
/*Some method
Check if any element inside the array matches the condition 
const sm1 = movements.includes(-130);
console.log(sm1);
//Basically the same as Include method but with some conditions
const sm = movements.some(mov => mov >= 3000);
console.log(sm);
*/
/*findIndex Method
const index = accounts.findIndex(el => el === account4);
console.log(index);//3
*/

/*Every Method to check if all the array elements match the condition
Same as some but some works for any element and every match the 
condition if every element match the condition otherwise wont work

const evry = movements.every(acc => acc > 0);
console.log(evry); //false
const evry2 = account4.movements.every(acc => acc > 0);
console.log(evry2); //true
*/

/*Flat method
const flatTest = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(flatTest.flat()); //Flatten the original array into
// a single array by removing inner array
const flatTest2 = [
  [[1, 2], 3],
  [4, [5, 6]],
  [7, [8, 9]],
];
console.log(flatTest2.flat(2)); //same but using 2 parameter inside
//flat to remove 3d inner array
*/
/*Flat Map method
//Traditional way to get all the movements through map method
//which creates a new array of movements ,then flat it to get the
// movement elements and the used redeuce to sum the value

const movesOnly = accounts
  .map(acc => (acc = acc.movements))
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(movesOnly);

//Same using flatMap method
//It simplify the flat and map method together
const moves = accounts.flatMap(acc => acc.movements);
console.log(moves); //used map and flat together
*/
/*Sorting
//console.log(movements);
console.log(movements.sort()); //sorting like a string

//ascending
// const sorting1 = movements.sort(function (a, b) {
//   //a=first,b=second element
//   if (a > b) return 1; //alternate position
//   if (a < b) return -1; //no change
// });
// console.log(sorting1);

//decsending
// const sorting2 = movements.sort(function (a, b) {
//   //a=first,b=second element
//   if (a > b) return -1; //no change
//   if (a < b) return 1; //alternate position
// });
// console.log(sorting2);

//basically returns negative for ascending and positive for
//decsending
const sort1 = movements.sort((a, b) => a - b);
console.log(sort1);

const sort2 = movements.sort((a, b) => b - a);
console.log(sort2);
*/

/* Hackathon challenge: ration of positive, negative and zeros length in a array
function plusMinus(arr) {
  // Write your code here
  //console.log(arr.length);
  let pos = [];
  let neg = [];
  let zeros = [];
  if (arr.length > 0 && arr.length <= 100) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > 0 && arr[i] <= 100) pos.push(arr[i]);
      else if (arr[i] < 0 && arr[i] >= -100) neg.push(arr[i]);
      else if (arr[i] === 0) zeros.push(arr[i]);
    }
  }
  console.log(pos, neg, zeros);
  console.log((pos.length / arr.length).toFixed(6));
  console.log((neg.length / arr.length).toFixed(6));
  console.log((zeros.length / arr.length).toFixed(6));
}
plusMinus([-4, 3, -9, 0, 4, 1]);
*/

/* Array.from method
//100 random cube numbers in an array
const z = Array.from({ length: 100 }, () => Math.trunc(Math.random() * 6) + 1);
console.log(z);

const ex = Array.from({ length: 10 }, (j, i) => i + 1); //Works exactly same as map() method after delcaring the
//object(length 10)
console.log(ex);

//Strings ,maps ,sets are iterable which can be converted to real arrray
//with the help of Array.from.
//another iterable: queryselectorAll
//get movements result from the UI and convert it to an array
const movementsUI = Array.from(document.querySelectorAll('.movements__value'));
//console.log(movementsUI); //will take the default values ,not from UI

// document.querySelector('.logo').addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value')
//   );
//   //attached with a UI element ,will give correct result
//   console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
// });

//Ar array.from takes map method as 2nd argument, thus followed the same below
document.querySelector('.logo').addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'), //array like structure
    el => Number(el.textContent.replace('€', '')) //map method with condition
  );
  //attached with a UI element ,will give correct result
  console.log(movementsUI);
});

//Same like above using array distructuring method
const movementsUI2 = [...document.querySelectorAll('.movements__value')].map(
  el => Number(el.textContent.replace('€', ''))
);
console.log(movementsUI2);
*/

/*Array method practice :

//Question 1: How much money deposited accross all the banks from accounts array?
const bankdepositSome = accounts
  .map(mov => mov.movements) //taking movements only from account1,2,..
  .flat() //taking all movements together
  //**could have done with flatMap method
  .filter(el => el > 0) //filtered only positive movements
  .reduce((acc, mov) => acc + mov, 0); //add them all
console.log(bankdepositSome);

//Question 2: How many deposits have been made of atleast 1000$
const depoThousands = accounts
  .flatMap(mov => mov.movements)
  .filter(el => el >= 1000).length;
console.log(depoThousands);
//same using reduce:
const depoThousandswithReduce = accounts
  .flatMap(mov => mov.movements)
  .reduce((acc, mov) => (mov >= 1000 ? acc + 1 : acc), 0);
console.log(depoThousandswithReduce);

//Question 3: Sum of all depo and withdraw with reduce method:
const sumofTransactions = accounts
  .flatMap(mov => mov.movements)
  // .reduce(
  //   (sum, cur) => {
  //     cur > 0 ? (sum.depo += cur) : (sum.withdrawl += cur);
  //     return sum; //We have to explicitely return the accumulator
  //     //as we are using curly brackets and return not there
  //     //implecitely
  //   },
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? 'depo' : 'withdrawl'] += cur;
      return sums;
    },
    { depo: 0, withdrawl: 0 } //defaults values of accumulator
  );
console.log(sumofTransactions);

//Question 4: Change anything to a subject line with string and array methods
//this is a nice title => This Is a Nice Title

const convertTitle = function (title) {
  const exception = [
    'and',
    'the',
    'of',
    'a',
    'an',
    'but',
    'or',
    'on',
    'in',
    'with',
  ];

  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exception.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitle('This is the main title'));
console.log(convertTitle('here goes the title OF THE year'));
console.log(convertTitle('and the title is expected'));
console.log(convertTitle('another sublime FOR the EXAMPLE'));
 */

//Final Coding challenge:

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];
//Solution 1:(Used forEach method)
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogs);

//Solution 2:(Used Find method)
const checkSarah = function (arr) {
  const findSarah = arr.find(mov => mov.owners.includes('Sarah'));
  console.log(findSarah);
  console.log(
    `Sarah's dog eating too ${
      findSarah.curFood > findSarah.recommendedFood ? 'much' : 'less'
    }`
  );
};
checkSarah(dogs);

//solution 3:
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

//Solution 4:

//"Matildaand Alice and Bob's dogs eat too much!" and "Sarah and
//John and Michael's dogs eat too little!"

console.log(`${ownersEatTooMuch.join(' and ')}'s dog eats too much`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dog eats too little`);

//Solution 5://no dog eating exact recommended amount
const checkRecomenndedFood = function (arr) {
  const check = arr.some(arr => arr.recommendedFood === arr.curFood);
  console.log(check);
};
checkRecomenndedFood(dogs);

//Solution 6://atleast 1 dog eating ok amount
const checkEatingok = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;
console.log(dogs.some(checkEatingok));

//Solution 7:
console.log(dogs.filter(checkEatingok));

//Solution 8://ascending order of rec. food
const ex = Array.from(dogs, dog => dog).sort(
  (a, b) => a.recommendedFood - b.recommendedFood
);
console.log(ex);
