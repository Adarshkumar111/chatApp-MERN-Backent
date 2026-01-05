import Message from "../models/message.js";

// get all users except the logged in user 
export const getUserForSidebar=async (req, res)=>{
    try {
        const userId=req.user._id;
        const filteredUsers= await User.find({_id: {$ne:userId}}).select("-password")

        // count number of message not seen
        const unseenMessage={}
        const promises= filteredUsers.map(async(user)=>{
            const messages = await Message.find({senderId: user._id, receiverId:userId, seen:false})

            if(messages.length>0){
                unseenMessage[user._id]=messages.length
            }
        })

        await Promise.all(promises);
        res.json({
            success:true,
            users:filteredUsers,
            unseenMessage
        })

    } catch (error) {
        console.log(error.message)
        res.json({
            success:false,
            message:error.messsage
        })
    }
}

// get chat between two users

export const getMessages=async(req, res)=>{
    try {
        
    } catch (error) {
        console.log(error.message)
        res.json({
            success:false,
            message:error.messsage
        })
    }
}