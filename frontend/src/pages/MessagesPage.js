import React, { useState, useEffect } from 'react';
import { fetchRecentConversations, 
         fetchConversation, 
         sendMessage, 
         initiateConversation 
        } from '../api/MessagesAPI';
import { fetchLikes, fetchLikedMe } from '../api/likesAPI';
import { useAuth0 } from '@auth0/auth0-react';
import '../styles/MessagesPage.css';

const MessagesPage = () => {
  const { user } = useAuth0();
  const userId = user?.sub;
  const [likes, setLikes] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const profilesPerPage = 4; // Show 4 profiles at a time

  // Load likes and recent conversations
  useEffect(() => {
    const loadData = async () => {
      try {
        const likedProfiles = await fetchLikes(userId);
        const likedMeProfiles = await fetchLikedMe(userId);
        const recentConversations = await fetchRecentConversations(userId);
        setLikes(likedMeProfiles);
        console.log("liked me: ", likedMeProfiles);
        setConversations(recentConversations);
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

  // Send a new message
  const handleSendMessage = async () => {
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
      console.log("profile id: ", profileId);
      const conversation = await initiateConversation(userId, profileId);
  
      // Update selected chat and messages
      setSelectedChat({ user_id: profileId }); // Set the clicked profile as the selected chat
      setMessages(conversation); // Set the fetched conversation
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
              key={conversation.sender_id}
              className={`conversation ${selectedChat?.user_id === conversation.sender_id ? 'active' : ''}`}
              onClick={() => setSelectedChat(conversation)}
            >
              <img src={`http://localhost:5000${conversation.photo_url}`} alt={conversation.first_name} />
              <div className="conversation-details">
                <p className="conversation-name">{conversation.first_name}</p>
                <p className="conversation-last-message">{conversation.message_text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <img src={`http://localhost:5000${selectedChat.photo_url}`} alt={selectedChat.first_name} />
              <h3>{selectedChat.first_name}</h3>
            </div>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.sender_id === userId ? 'sent' : 'received'}`}
                >
                  <p>{message.message_text}</p>
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Send a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
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
