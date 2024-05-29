//fetch user account information data
export const fetchUserData = async (username: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();
      console.log("Original dataUser:", data);
      return data;
      //retrieve data in the json format
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

//fetch user public repo data
export const fetchPublicRepoData = async (username: string) => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching public repo data:', error);
      return null;
    }
  };
