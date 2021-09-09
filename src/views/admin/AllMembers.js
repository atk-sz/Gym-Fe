import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllGymMembers } from "../../api/gym";
import { Card, Table } from "react-bootstrap";
import { BsArrowUpDown } from "react-icons/bs";
import * as AiIcons from "react-icons/ai";
import "./styles/members.css";

const AllMembers = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [nameSort, setNameSort] = useState(true);
  const [joinSort, setJoinSort] = useState(true);
  const [activeSort, setActiveSort] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const sortByName = () => {
    let membersUpdate = members
    if (nameSort) {
      membersUpdate.sort((a, b) => (a.fname > b.fname) ? 1 : ((b.fname > a.fname) ? -1 : 0))
      membersUpdate.reverse()
    }
    else
      membersUpdate.sort((a, b) => (a.fname > b.fname) ? 1 : ((b.fname > a.fname) ? -1 : 0))
    setMembers(membersUpdate)
    setNameSort(!nameSort)
  }

  const sortByJoin = () => {
    let membersUpdate = members
    if (joinSort) {
      membersUpdate.sort((a, b) => (new Date(b.join) - new Date(a.join)));
    }
    else
      membersUpdate.sort((a, b) => (new Date(a.join) - new Date(b.join)));
    setMembers(membersUpdate)
    setJoinSort(!joinSort)
  }

  const sortByActive = () => {
    let membersUpdate = members
    if (activeSort) {
      membersUpdate.sort((a, b) => ((a.active === b.active) ? 0 : a.active ? -1 : 1));
    }
    else
      membersUpdate.sort((a, b) => ((a.active === b.active) ? 0 : a.active ? 1 : -1));
    setMembers(membersUpdate)
    setActiveSort(!activeSort)
  }

  const updateAllMembers = (members) => {
    return new Promise((resolve, reject) => {
      const updatedMember = members.map(each => {
        let member = each
        member.fullName = `${each.fname} ${each.lname}`
        return member
      })
      console.log(updatedMember)
      resolve(updatedMember)
    })
  }

  const loadMembers = async () => {
    try {
      const res = await getAllGymMembers(user.token);
      const updatedMembers = await updateAllMembers(res.data)
      setMembers(updatedMembers);
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

  const displayDate = (date) => {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  }

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
                    <th onClick={sortByName}>Name <BsArrowUpDown cursor /></th>
                    <th onClick={sortByJoin}>Join <BsArrowUpDown cursor /></th>
                    <th onClick={sortByActive}>Active <BsArrowUpDown /></th>
                    <th>View</th>
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
                          {each.fullName}
                        </td>
                        <td>{displayDate(new Date(each.join))}</td>
                        <td><div className={each.active ? 'member-active-green' : 'member-expire-red'} style={{ width: '10px', height: '10px', margin: 'auto' }}></div></td>
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
