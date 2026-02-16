import React from 'react'
import { Row, Col , Container } from "react-bootstrap";
import "./PartSubscribe.css"
const PartSubscribe = () => {
  return (
    <div className="Subscribe">
      <Container>
        <p>Subscribe on our newsletter</p>

        <span>
          Get daily news on upcoming offers from many suppliers all over the
          world
        </span>
        <form action="#">
          <input type="text" placeholder="Email" />
          <button>Subscribe</button>
        </form>
      </Container>
    </div>
  );
};

export default PartSubscribe;
