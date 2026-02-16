import React from 'react'
import Extra1 from "../../Images/extra1.png"
import Extra2 from "../../Images/extra2.png"
import Extra3 from "../../Images/extra3.png"
import Extra4 from "../../Images/extra4.png"
import { FaSearch } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import { MdInventory } from "react-icons/md";
import { MdOutlineSend } from "react-icons/md";
import { Container, Row, Col } from "react-bootstrap";
import "./Ourextraservices.css"

const Ourextraservices = () => {
  return (
          <div className="Our_Extra_services">
        <Container>
          <h2>Our extra services</h2>
          <Row className='g-md-3'>
            <Col lg={3} className='col-md-6 col-sm-6 col-12'>
              <div>
                <div className="holderImage">
                  <img src={Extra1} alt="sdsdsd" />
                </div>
                <div className="text">
                  <p>
                    Customize Your <br /> Products
                  </p>
                  <span>
                    <FaSearch />
                  </span>
                </div>
              </div>
            </Col>
            <Col lg={3} className='col-md-6 col-sm-6 col-12'>
              <div>
                <div className="holderImage">
                  <img src={Extra2} alt="sdsdsd" />
                </div>
                <div className="text">
                  <p>
                    Source from <br />
                    Industry Hubs
                  </p>
                  <span>
                    <MdInventory />
                  </span>
                </div>
              </div>
            </Col>
            <Col lg={3} className='col-md-6 col-sm-6 col-12'>
              <div>
                <div className="holderImage">
                  <img src={Extra3} alt="sdsdsd" />
                </div>
                <div className="text">
                  <p>
                    Fast, reliable shipping <br /> by ocean or air
                  </p>
                  <span>
                    <MdOutlineSend />
                  </span>
                </div>
              </div>
            </Col>
            <Col lg={3} className='col-md-6 col-sm-6 col-12'>
              <div>
                <div className="holderImage">
                  <img src={Extra4} alt="sdsdsd" />
                </div>
                <div className="text">
                  <p>
                    Product monitoring <br /> and inspection
                  </p>
                  <span>
                    <MdOutlineSecurity />
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
  )
}

export default Ourextraservices