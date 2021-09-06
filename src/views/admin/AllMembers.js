import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllGymMembers } from "../../api/gym";
import { Card, Table } from "react-bootstrap";
import * as AiIcons from "react-icons/ai";
import "./styles/members.css";
const AllMembers = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);
  const loadMembers = async () => {
    try {
      const res = await getAllGymMembers(user.token);
      setMembers(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response
          ? error.response.data
          : "Some error occured please try later"
      );
      console.log(error);
    }
  };

  return (
    <div className="container-fluid all-member-of-gym-div">
      <div className="row">
        <div className="col-md-12">
          <Card>
            <Card.Body>
              <h4>Member Details</h4>
              <Table>
                <thead>
                  <tr>
                    <th>Card Id</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <h1 className="text-center">loading</h1>
                  ) : members && members.length ? (
                    members.map((each, i) => (
                      <tr key={i}>
                        <td>{each.card_id}</td>
                        <td>
                          {each.fname} {each.lname}
                        </td>
                        <td>{each.email}</td>
                        <td>
                          <Link to={`/gym/member/${each._id}`}>
                            <AiIcons.AiOutlineEye />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    ""
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AllMembers;
