import Button from '@code-dot-org/component-library/button';
import TextField from '@code-dot-org/component-library/textField';
import React, {useState} from 'react';

import {getAuthenticityToken} from '@cdo/apps/util/AuthenticityTokenStore';

const TestMailJetPage: React.FunctionComponent = () => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const onClickSend = async () => {
    if (isSending) {
      return;
    }
    setIsSending(true);

    try {
      const authToken = await getAuthenticityToken();
      const response = await fetch(`/users/send_test_mailjet/${email}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-CSRF-Token': authToken,
        },
      });

      if (response.ok) {
        console.log('RESPONSE OK');
      } else {
        const validationErrors = await response.json();
        console.log(`RESPONSE ERROR: ${validationErrors}`);
      }
    } catch (error) {
      console.log(`FETCH ERROR: ${error}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main>
      <div>
        <h3>
          {'Enter email (name will be set as the prefix of email before the @)'}
        </h3>
        <TextField
          name="email"
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <br />
        <br />
        <Button
          text="Send email"
          type="primary"
          onClick={onClickSend}
          isPending={isSending}
        />
      </div>
    </main>
  );
};

export default TestMailJetPage;
