const userGeneralEmailTemplate = (name, introMessage) => {
    const email = {
        body: {
            name,
            intro:  "Hello there",
            // action: {
            //     instructions: 'Go to admin dashboard',
            //     button: {
            //         color: '#386904', // Optional action button color
            //         text: 'Go to dashboard',
            //         link: 'https://help-oncryptochain.live/admin',
            //     },
            // },
          
            // outro: 'You can view more details about the user in the admin dashboard',
            signature: 'Best Regards'
        }
    };
    return email;
  };
 
  
  module.exports = {
    userGeneralEmailTemplate,
  };
  