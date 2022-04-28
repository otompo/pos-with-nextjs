import React, { useState } from 'react';
import { Button } from 'antd';

function ButtonComponent({ onClick, title }) {
  const [buttons, setButtons] = useState([]);

  return (
    <div>
      <Button type="primary" shape="round" size="large" onClick={onClick}>
        {title}
      </Button>
    </div>
  );
}

export default ButtonComponent;
