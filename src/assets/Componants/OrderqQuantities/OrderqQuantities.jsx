import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Nav, NavLink } from "react-bootstrap";
import "./OrderqQuantities.css";
const OrderqQuantities = () => {
  return (
    <div>
      <div className="anotherOrder">
        <Container>
          <Row>
            <Col className="col-lg-6 col-12">
              <div className="left">
                <p>
                  An easy way to send <br /> requests to all suppliers
                </p>
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipisicing <br />{" "}
                  elit, sed do eiusmod tempor incididunt.
                </span>
              </div>
            </Col>
            <Col className="col-lg-6 col-12">
              <div className="right">
                <form>
                  <p>Send quote to suppliers</p>
                  <input type="text" placeholder="What item you need?" />
                  <textarea
                    name=""
                    id=""
                    placeholder="Type more details"
                  ></textarea>
                  <div className=" count">
                    <input type="number" placeholder="Quantity" />
                    <select name="" id="">
                      <option value="1">Pcs</option>
                      <option value="1">cm</option>
                      <option value="1">m</option>
                      <option value="1">Pcs</option>
                      <option value="1">Box</option>
                    </select>
                  </div>

                  <button className="btn ">Send inquiry</button>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default OrderqQuantities;
