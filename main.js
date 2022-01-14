let addBook = document.getElementById('add-book')
let showMenu = document.getElementById('show-menu')
let main = document.getElementsByClassName('main')[0]
let clearAll = document.getElementById('clear-all')
//form variables
let formDiv = document.getElementById('form-div')
let form = document.getElementById('form')
let title = document.getElementById('name')
let author = document.getElementById('author')
let pages = document.getElementById('pages')
let read = document.getElementById('read')
const inputs = document.querySelectorAll('input')
//      //      //
function handleForm(event) {event.preventDefault()}
form.addEventListener('submit', handleForm)
//      //      //
const pattern = {
    name: /^.{1,50}$/, 
    author: /^.{1,30}$/, 
    pages: /^\d{1,6}$/,
}
let library = []

class Book{
    constructor(name, author, pages, read, data ){
        this.name = name
        this.author = author
        this.pages = pages
        this.read = read
        this.data = data
    }
}
//       //      //      //

// Cards variables
let remove_btn = []
let cards = []
let h4 = []
let p = []
let checkboxes = []
let checklabels = []
async function addBookCard(){console.log(library)
    for(let i=0; i< library.length; i++){
        if(!cards[i]){
            //Create the book cards
            cards[i] = document.createElement("div")
            cards[i].setAttribute('class', 'cards')
            //Create h4 elements
            h4[i] = document.createElement('h4')
            h4[i].setAttribute('class', 'book-title')
            h4[i].innerHTML = `${library[i].name}`
            //Create p elements
            p[i] = document.createElement('p')
            p[i].setAttribute('class', 'book-info')
            p[i].innerHTML = 'By ' + library[i].author + '<br/>' + 'Pages: '+ library[i].pages
            //Create the input type checkbox and labels
            checkboxes[i] = document.createElement('input')
            checklabels[i] = document.createElement('label')
            checklabels[i].setAttribute('class', 'checkbox')
            checklabels[i].setAttribute('for', `read${i}`)
            checkboxes[i].type = 'checkbox'
            checkboxes[i].setAttribute('id', `read${i}`)
            //Create a remove button 
            remove_btn[i] = document.createElement('button')
            remove_btn[i].setAttribute('class','remove_btn')
            remove_btn[i].innerHTML = '<i class="fas fa-times-circle"></i>'
            // Append elements
            main.appendChild(cards[i])
            cards[i].appendChild(remove_btn[i])
            cards[i].appendChild(h4[i])
            cards[i].appendChild(p[i])
            cards[i].appendChild(checkboxes[i])
            cards[i].appendChild(checklabels[i])
            //Change the check status of the checkbox
            checkboxes[i].checked = library[i].read
            checkboxes[i].addEventListener('change', async ()=> {
                library[i].read = checkboxes[i].checked
                await updateLibraryDB()
            })
        }
    }
    delete_btn()
}
//       //      //      //
async function delete_btn(){
    remove_btn.forEach((btn,i)=>{
            btn.onclick = async ()=>{
            btn.parentNode.remove()
            library.splice(i,1)
            cards.splice(i,1)
            remove_btn.splice(i,1)
            await updateLibraryDB()
        }
    })
}
clearAll.addEventListener('mouseup',clearLocalData)
function clearLocalData(){
    localStorage.clear()
    while(main.childElementCount!= 0){
        main.lastChild.remove()
    }
}
//      //   Show the add book menu   //      //
showMenu.addEventListener('mouseup', Menu)
function Menu(){
    formDiv.style.visibility = 'visible'
    formDiv.style.animation = 'none'
    form.style.animation = 'bookmenu .5s cubic-bezier(0, 0.25, 0, 0.79)'
}
//      //  Hide book menu  //        //
window.onclick = function(e){
    if(e.target == formDiv){
        form.style.animation = 'closemenu .5s ease-out forwards'
        formDiv.style.animation = 'formDivClose .5s ease-out forwards'
    }
}
//      //      //      //
addBook.addEventListener('mouseup', addBookToLibrary) 

function addBookToLibrary(){
    let fname = title.value
    let fauthor = author.value
    let fpages = pages.value
    let fread = read.checked
    let findex = library.length
    if(title.classList[1] === 'valid' && author.classList[1]=== 'valid' ){
        if(pages.classList[1]==='valid'){
            library.push(new Book(fname, fauthor, fpages, fread, findex))
            form.style.animation = 'closemenu .5s ease-out forwards'
            formDiv.style.animation = 'formDivClose .5s ease-out forwards'
        }   
    }
    addBookCard()
    updateLibraryDB()
}
//      //   Validate fields   //      //
function validate(field,regex){
    if(regex.test(field.value)){
        field.classList.add('valid')
        field.classList.remove('invalid')
    }else{
        field.classList.remove('valid')
        field.classList.add('invalid')
    }
}

inputs.forEach((input)=>{
    input.addEventListener('keyup', (e) =>{
        validate(e.target, pattern[e.target.name]);
    })
})
//
const showUserInfo = (user) => {
    logInBtn.classList.add('inactive')
    logOutBtn.classList.remove('inactive')
    userId.innerText = user.displayName
    profilePicture.style.background = `url(${user.photoURL})`
    userProfile.classList.remove('inactive')
}
const removeUserInfo = () => {
    logInBtn.classList.remove('inactive')
    logOutBtn.classList.add('inactive')
    userProfile.classList.add('inactive')
}
// config
const firebaseConfig = {
    apiKey: "AIzaSyDvAZjP4O4a3E724xY35klt9WlU3b7T1OA",
    authDomain: "my-library-a4b37.firebaseapp.com",
    databaseURL: "https://my-library-a4b37-default-rtdb.firebaseio.com",
    projectId: "my-library-a4b37",
    storageBucket: "my-library-a4b37.appspot.com",
    messagingSenderId: "813409790518",
    appId: "1:813409790518:web:37ddde16463a8c865fc697",
    measurementId: "G-SD8NCMF36Y"
  }
  
firebase.initializeApp(firebaseConfig);
//   Firebase auth   //      
const auth = firebase.auth()
const userId = document.getElementById('userId')
const profilePicture = document.getElementById('profilePicture')
const logInBtn = document.getElementById('login')
const logOutBtn = document.getElementById('logout')
const userProfile = document.getElementById('user-profile')

auth.onAuthStateChanged(async (user) => {
    if(user) {
        showUserInfo(user) 
        setupRealTimeListener()
        await updateLibraryDB()
        addBookCard()
    }   
    else {
        removeUserInfo()
    }
})

const signIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
}

const signOut = () => {auth.signOut()}

logInBtn.onclick = signIn
logOutBtn.onclick = signOut

//        //    Firestore    //       //
const db = firebase.firestore()
let unsubscribe 

const setupRealTimeListener = () => {
    unsubscribe = db
    .collection('Library')
    .where('ownerId', '==', auth.currentUser.uid)
    .orderBy('createdAt')    
}

const updateLibraryDB =  async () => {
    try{

        if ( await auth.currentUser) {
            const oldLib =  await db
            const currentDoc = oldLib.collection("Library").doc(auth.currentUser.uid)
            const snapshot = await oldLib.collection("Library").get()  
            const booklist = snapshot.docs.find((doc) => doc.id === auth.currentUser.uid )    
            
            if(library.length === 0 && booklist) {library = JSON.parse(JSON.stringify(booklist.data().BookList)) }
            // console.log([booklist.data().BookList, library])

            const pureLibrary = library.map(obj => Object.assign({}, obj))
            await currentDoc.set({BookList: pureLibrary})
            console.log(currentDoc)
            
        }
    } catch(e) {console.log(e)}
     
}


//       //      //       //      
