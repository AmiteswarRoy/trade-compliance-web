import React from 'react';

type Props = {
  errorMessage: string
};

function PageError(props: Props) {
  const { errorMessage } = props;

  return (
    <div className='comp--shared-page-error'>
      <div className='message'>{ errorMessage }</div>
    </div>
  );
}

export default PageError;
