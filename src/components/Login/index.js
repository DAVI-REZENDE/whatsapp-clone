import React from 'react';

import './styles.css';
import Api from '../../Api';

function Login({onReceive}) {

    const handleFacebookLogin = async() => {
        let result = await Api.fbPopup();
        if(result){
            onReceive(result.user)
        }else{
            alert("Erro!")
        }
    }

  return(
      <div className="login">
          <h3>Para continuar, você deve fazer login</h3>
          <button onClick={handleFacebookLogin}>Login from Facebook</button>
      </div>
  );
}

export default Login;