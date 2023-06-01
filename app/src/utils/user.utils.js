let userList = [
    {
        id:"1",
        username:"admin1",
        room:"js1",
    },
    {
        id:"2",
        username:"admin2",
        room:"js2",
    },
]

const addUser = (newUser) => userList = [...userList,newUser]

const getUserList = (room) => userList.filter((user)=>user.room === room)

const removeUser = (id) => userList = userList.filter((user)=>user.id !== id)

const findUser = (id) => userList.find((user)=>user.id === id)
module.exports ={
    getUserList,
    addUser,
    removeUser,
    findUser
}