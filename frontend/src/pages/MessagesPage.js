import React, { useState, useEffect } from 'react';
import { fetchRecentConversations, 
         fetchConversation, 
         sendMessage, 
         initiateConversation,
         markMessagesAsRead, 
         getUnreadMessagesCount
        } from '../api/MessagesAPI';
import { fetchLikes, fetchLikedMe } from '../api/likesAPI';
import { fetchUserProfileByUserId } from '../api/UserAPI';
import { checkPermission } from '../api/PermissionsAPI';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/MessagesPage.css';

const MessagesPage = ()  => {
  const { user } = useAuth0();
  const userId = user?.sub;
  const [likes, setLikes] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const profilesPerPage = 4; // Show 4 profiles at a time

  useEffect(() => {
    // Apply overflow hidden when component mounts
    document.body.style.overflow = 'hidden';
    return () => {
      // Reset overflow when component unmounts
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const chatMessages = document.querySelector('.chat-messages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }
  }, [messages]); // Trigger when messages update
  // Load likes and recent conversations

  useEffect(() => {
    const loadData = async () => {
      try {
        const likedProfiles = await fetchLikes(userId);
        const likedMeProfiles = await fetchLikedMe(userId);
        const recentConversations = await fetchRecentConversations(userId);
        
        setLikes(likedMeProfiles);
        console.log("recent conversation: ", recentConversations);

        // Sort conversations based on `created_at` field, descending order
        const sortedConversations = recentConversations.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setConversations(sortedConversations);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    if (userId) loadData();
  }, [userId]);


  // Load messages when a conversation is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedChat) {
        try {
          const chatMessages = await fetchConversation(userId, selectedChat.user_id);
          setMessages(chatMessages);
        } catch (error) {
          console.error('Error loading messages:', error);
        }
      }
    };
    loadMessages();
  }, [selectedChat, userId]);

  // useEffect(() => {
  //   const intervalId = setInterval(async () => {
  //     try {
  //       const updatedConversations = await fetchRecentConversations(userId);
  //       setConversations((prevConversations) => {
  //         // Update unread status dynamically
  //         return updatedConversations.map((updated) => {
  //           const prev = prevConversations.find((conv) => conv.user_id === updated.user_id);
  //           return { ...updated, unread: updated.unread || prev?.unread };
  //         });
  //       });
  //     } catch (error) {
  //       console.error('Error fetching updated conversations:', error);
  //     }
  //   }, 5000); // Poll every 5 seconds
  
  //   return () => clearInterval(intervalId); // Cleanup on unmount
  // }, [userId]);
  

  // Send a new message
  const handleSendMessage = async () => {
    const chesckPermission = await checkPermission(userId, selectedChat.user_id);
    console.log("PERMISSION: ", chesckPermission)
    if (newMessage.trim() === '') return;
    try {
      await sendMessage(userId, selectedChat.user_id, newMessage);
      setMessages([...messages, { sender_id: userId, message_text: newMessage, created_at: new Date() }]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleProfileClick = async (profileId) => {
    try {
      // Fetch the conversation with the clicked profile
      const conversation = await initiateConversation(userId, profileId);
      const profileDetails = await fetchUserProfileByUserId(profileId);

      // Mark all messages as read in the backend
      await markMessagesAsRead(userId, profileId); // Ensure this backend function is working correctly
  
      const updatedUnreadCount = await getUnreadMessagesCount(userId);
      console.log("MESSAGE unread messages count: ", updatedUnreadCount)

      // Update selected chat and messages
      setSelectedChat({ user_id: profileId, ...profileDetails });
      console.log("set slected chat: ", selectedChat);
      setMessages(conversation);
  
      // Update the conversations state to mark this conversation as read
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.user_id === profileId ? { ...conv, unread: false } : conv
        )
      );
    } catch (error) {
      console.error('Error initiating conversation:', error);
    }
  };

  const handleNext = () => {
    if (startIndex + profilesPerPage < likes.length) {
      setStartIndex(startIndex + profilesPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - profilesPerPage);
    }
  };

  return (
    <div className="messages-page">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Likes and Matches Section */}
        
      <div className="likes-and-matches-container">
      <h3>Likes and Matches</h3>
      <div className="profiles-wrapper-messages">
        <button
          className="nav-button-messages"
          onClick={handlePrev}
          disabled={startIndex === 0}
        >
          &#10094; {/* Left Arrow */}
        </button>
        <div className="profiles-messages">
          
        {likes.slice(startIndex, startIndex + profilesPerPage).map((profile, index) => (
          <div
            className="profile-messages"
            key={index}
            onClick={() => handleProfileClick(profile.user_id)} // Initiate conversation on click
          >
            <img
              src={`http://localhost:5000${profile.photo_url}`}
              alt={`${profile.first_name}`}
              className="profile-picture-messages"
            />
            <div className="profile-background-messages">
              <p className="profile-name-messages">{profile.first_name}</p>
            </div>
          </div>
        ))}

        </div>
        <button
          className="nav-button-messages"
          onClick={handleNext}
          disabled={startIndex + profilesPerPage >= likes.length}
        >
          &#10095; {/* Right Arrow */}
        </button>
      </div>
    </div>

        {/* Messages List */}
        <div className="messages-list">
          <h3>Messages</h3>
          {conversations.map((conversation) => (
            <div
              key={conversation.user_id}
              className={`conversation ${selectedChat?.user_id === conversation.user_id ? 'active' : ''}`}
              onClick={() => {
                setSelectedChat(conversation);
                handleProfileClick(conversation.user_id);
              }}
            >
              <img 
                src={`http://localhost:5000${conversation.photo_url}`} 
                alt={conversation.first_name} 
                className="conversation-picture"
              />
              <div className="conversation-details">
                <p className="conversation-name">{conversation.first_name}</p>
                <p className="conversation-last-message">
                  {conversation.message_text.length > 50 
                    ? `${conversation.message_text.slice(0, 50)}...` 
                    : conversation.message_text}
                </p>
              </div>
              {conversation.unread && <div className="unread-indicator"></div>}
            </div>
          ))}
        </div>

        
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <div className="chat-header-profile">
                {selectedChat.profile_photo && (
                  <img
                    src={`http://localhost:5000${selectedChat.profile_photo}`}
                    alt={`${selectedChat.first_name}'s profile`}
                    className="chat-header-picture"
                  />
                )}
                <h3 className="chat-header-name">{selectedChat.first_name}</h3>
              </div>
            </div>

            <div className="chat-messages">
              {messages
                .slice()
                .sort((b, a) => new Date(a.created_at) - new Date(b.created_at))
                .map((message, index) => (
                  <div
                    key={index}
                    className={`message-container ${message.sender_id === userId ? 'sent' : 'received'}`}
                  >
                    <div className={`message ${message.sender_id === userId ? 'sent' : 'received'}`}>
                      <p className="message-text">{message.message_text}</p>
                      <span className="message-timestamp">
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              <div id="scroll-anchor"></div> {/* Dummy div */}
            </div>


            <div className="chat-input-container">
              <div className="chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>

          </>
        ) : (
          <p className="no-chat-selected">Select a conversation to start messaging</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
