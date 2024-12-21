import React, { useState, useEffect } from 'react';
import { fetchRecentConversations, 
         fetchConversation, 
         sendMessage, 
         initiateConversation,
         markMessagesAsRead, 
         getUnreadMessagesCount
        } from '../api/MessagesAPI';
import { fetchLikes, fetchLikedMe } from '../api/ULikesAPI';
import { fetchUserProfileByUserId } from '../api/UserAPI';
import { checkPermission } from '../api/PermissionsAPI';
import { useAuth0 } from '@auth0/auth0-react';
import MessagesPagePreview from '../components/MessagesPagePreview';
import { useLocation } from 'react-router-dom';
import '../styles/MessagesPage.css';

const MessagesPage = ()  => {
  const { user } = useAuth0();
  const userId = user?.sub;
  const [likes, setLikes] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [canMessage, setCanMessage] = useState(true);
  const [viewMode, setViewMode] = useState('chat');
  const [profilesPerPage, setProfilesPerPage] = useState(4);
  const { state } = useLocation();
  const initialSelectedUserId = state?.selectedUserId || null;

  useEffect(() => {
    // Apply overflow hidden when component mounts
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    return () => {
      // Reset overflow when component unmounts
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const updateProfilesPerPage = () => {
      const width = window.innerWidth;
      if (width < 1337 && width > 1220) {
        setProfilesPerPage(3);
      } else if (width <= 1220 && width > 870) {
        setProfilesPerPage(2);
      } else if (width <= 870) {
        setProfilesPerPage(1);
      } else {
        setProfilesPerPage(4); // Default to 4 if none of the above conditions match
      }
    };

    // Initial check and event listener
    updateProfilesPerPage();
    window.addEventListener('resize', updateProfilesPerPage);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('resize', updateProfilesPerPage);
    };
  }, []);

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

  useEffect(() => {
    const chatMessagesContainer = document.querySelector('.chat-messages');

    if (viewMode === 'chat' && chatMessagesContainer) {
      // Scroll to the bottom when in "Chat" view
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    } else if (viewMode === 'preview' && chatMessagesContainer) {
      // Scroll to the top when in "Preview Profile" view
      chatMessagesContainer.scrollTop = 0;
    }
  }, [viewMode]); // Trigger whenever viewMode changes

  useEffect(() => {
    // Automatically set the selected chat if an initial user ID is provided
    if (initialSelectedUserId) {
      const loadChat = async () => {
        try {
          const profileDetails = await fetchUserProfileByUserId(initialSelectedUserId);
          setSelectedChat({ user_id: initialSelectedUserId, ...profileDetails });
        } catch (error) {
          console.error('Error loading initial chat:', error);
        }
      };
      loadChat();
    }
  }, [initialSelectedUserId]);

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
      console.log("profile click profile ID: ", profileId);
      setSelectedProfileUserId(profileId);
      console.log("Fetched profile: ", selectedProfileUserId);
      const permissionResponse = await checkPermission(profileId, userId);
      console.log("Message Permission?: ", permissionResponse);
      setCanMessage(permissionResponse);
  
      // Fetch the conversation with the clicked profile
      const conversation = await initiateConversation(userId, profileId);
      console.log("Conversation data: ", conversation);
  
      // Fetch profile details
      const profileDetails = await fetchUserProfileByUserId(profileId);
      
      console.log("Fetched profile details: ", profileDetails);
      
  
      if (profileDetails) {
        // Set the selected chat with profile and conversation details
        setSelectedChat({ user_id: profileId, ...profileDetails });
        setMessages(conversation);
      }
  
      // Mark all messages as read in the backend
      await markMessagesAsRead(userId, profileId);
  
      // Update conversations to mark as read
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.user_id === profileId ? { ...conv, unread: false } : conv
        )
      );
  
      console.log("Set selected chat: ", { user_id: profileId, ...profileDetails });
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
          <h3>Likes og Matcher</h3>
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
                    src={`${profile.photo_url}`}
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
          <h3>Meldinger</h3>
          {conversations.map((conversation) => (
            <div
              key={conversation.user_id}
              className={`conversation ${selectedChat?.user_id === conversation.user_id ? 'active' : ''}`}
              onClick={() => {
                handleProfileClick(conversation.user_id);
                setSelectedChat(conversation);
              }}
            >
              <img
                src={`${conversation.photo_url}`}
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
                    src={`${selectedChat.profile_photo}`}
                    alt={`${selectedChat.first_name}'s profile`}
                    className="chat-header-picture"
                  />
                )}
                <h3 className="chat-header-name">{selectedChat.first_name}</h3>
              </div>
              <div className="chat-header-buttons">
                <button
                  className={`chat-header-button ${viewMode === 'chat' ? 'active' : ''}`}
                  onClick={() => setViewMode('chat')}
                >
                  Vis chat
                </button>
                <button
                  className={`chat-header-button ${viewMode === 'preview' ? 'active' : ''}`}
                  onClick={() => setViewMode('preview')}
                >
                  Vis profil
                </button>
              </div>
            </div>
            {!canMessage && (
              <div className="no-permission-message">
                {`${selectedChat.first_name} har ikke tillatelse til å sende deg meldinger. Hvis du vil gi dem tilgang, kan du enten sende en melding eller like profilen deres.`}
              </div>
            )}
            <div
              className={`chat-messages ${
                viewMode === 'preview' ? 'chat-messages-preview' : ''
              }`}
            >
              {viewMode === 'chat' ? (
                <>
                  {messages
                    .slice()
                    .sort((b, a) => new Date(a.created_at) - new Date(b.created_at))
                    .map((message, index) => (
                      <div
                        key={index}
                        className={`message-container ${
                          message.sender_id === userId ? 'sent' : 'received'
                        }`}
                      >
                        <div
                          className={`message ${
                            message.sender_id === userId ? 'sent' : 'received'
                          }`}
                        >
                          <p className="message-text">{message.message_text}</p>
                          <span className="message-timestamp">
                            {new Date(message.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  <div id="scroll-anchor"></div>
                </>
              ) : (
                <MessagesPagePreview selectedProfileId={selectedChat.user_id} />
              )}
            </div>
            {viewMode === 'chat' && (
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
            )}
          </>
        ) : (
          <p className="no-chat-selected">Trykk på en bruker i panelet til venstre for å starte en samtale</p>
        )}
      </div>

    </div>
  );
  
  
};

export default MessagesPage;
