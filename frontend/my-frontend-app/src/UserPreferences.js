import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserPreferences = () => {
  const [userPreferences, setUserPreferences] = useState(null);
  const userId = '667a6424b2de1ef3a5653b0f'; 

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/userPrefs/get/${userId}`);
        setUserPreferences(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserPreferences();
  }, [userId]);

  return (
    <div>
      {userPreferences ? (
        <div>
          <h2>{userPreferences.name}'s Preferences</h2>
          <ul>
            {userPreferences.preferences.keyValues.map((pref, index) => (
              <li key={index}>
                {pref.key}: {pref.value}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading user preferences...</p>
      )}
    </div>
  );
};

export default UserPreferences;
