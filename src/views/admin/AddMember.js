import React from "react";
import { AddMemberForm } from "../../components";
import { Card } from "react-bootstrap";

const AddMember = () => {
  return (
    <div className="container-fluid add-member-div">
      <div className="row">
        <div className="col-md-8 ">
          <Card className="shadow-sm">
            <Card.Body>
              <AddMemberForm />
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
