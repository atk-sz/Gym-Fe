import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddEventForm = ({ handleSubmit, editEvent, members }) => {
  const initialValues = {
    title: "title",
    description: "description",
    location: "location",
    start: "",
    end: "",
    tags: members,
    number_of_guests: 100,
  };

  const initialValues1 = {
    minAge: 0,
    maxAge: 0,
    male: true,
    female: true,
  };

  const [values, setValues] = useState(editEvent ? editEvent : initialValues);
  const [showFilter, setShowFilter] = useState(false);
  const [load, setLoad] = useState(false);
  const [values1, setValues1] = useState(initialValues1);
  const [keyword, setKeyword] = useState("");
  const [allMembers, setAllMembers] = useState(members);
  const [filtedMembers, setFiltedMembers] = useState(
    editEvent ? editEvent.tags : []
  );

  const getAge = (dateString) => {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filterByAgeFunc = (minAge, maxAge, members) => {
    return new Promise((resolve, reject) => {
      if (minAge == 0 && maxAge == 0) return resolve(members);
      const resultingMembers = members.filter(
        (each) => getAge(each.DOB) <= maxAge && getAge(each.DOB) >= minAge
      );
      resolve(resultingMembers);
    });
  };

  const filterByGenderFunc = (male, female, members) => {
    return new Promise((resolve, reject) => {
      if (male && !female) {
        const resMembers = members.filter((each) => each.gender === "male");
        resolve(resMembers);
      } else if (!male && female) {
        const resMembers = members.filter((each) => each.gender === "female");
        resolve(resMembers);
      } else {
        resolve(members);
      }
    });
  };

  const filterAllMembers = async (minAge, maxAge, male, female) => {
    const ageResMembers = await filterByAgeFunc(minAge, maxAge, members);
    const resMembers = await filterByGenderFunc(male, female, ageResMembers);
    setAllMembers(resMembers);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChange1 = (e) => {
    if (e.target.name === "minAge") {
      filterAllMembers(
        e.target.value,
        values1.maxAge,
        values1.male,
        values1.female
      );
    } else {
      filterAllMembers(
        values1.minAge,
        e.target.value,
        values1.male,
        values1.female
      );
    }
    setValues1({ ...values1, [e.target.name]: e.target.value });
  };

  const addMinimumValues = (e) => {
    if (!e.target.value) {
      if (e.target.name === "minAge") {
        if (values1.maxAge > 0)
          setValues1({ ...values1, minAge: values1.maxAge });
        else setValues1({ ...values1, minAge: 0 });
      } else {
        if (values1.minAge > 0)
          setValues1({ ...values1, maxAge: values1.minAge });
        else setValues1({ ...values1, maxAge: 0 });
      }
    }
  };

  const handleOnlyMale = async (e) => {
    filterAllMembers(
      values1.minAge,
      values1.maxAge,
      e.target.checked,
      values1.female
    );
    setValues1({ ...values1, male: e.target.checked });
  };

  const handleOnlyFemale = async (e) => {
    filterAllMembers(
      values1.minAge,
      values1.maxAge,
      values1.male,
      e.target.checked
    );
    setValues1({ ...values1, female: e.target.checked });
  };

  const handleAdd = (member) => {
    setLoad(true);
    let localFiltedMembers = filtedMembers;
    const i = localFiltedMembers.findIndex(
      (item) => item.card_id === member.card_id
    );
    if (i >= 0) toast.error("Already Added");
    else localFiltedMembers.push(member);
    setFiltedMembers(localFiltedMembers);
    setTimeout(() => {
      setLoad(false);
    }, [50]);
  };

  const handleRemove = (member) => {
    setLoad(true);
    let localFiltedMembers = filtedMembers;
    const i = localFiltedMembers.findIndex(
      (item) => item.card_id === member.card_id
    );
    if (i >= 0) localFiltedMembers.splice(i, 1);
    setFiltedMembers(localFiltedMembers);
    setTimeout(() => {
      setLoad(false);
    }, [50]);
  };

  const addAll = (e) => {
    e.preventDefault();
    setLoad(true);
    let localFiltedMembers = filtedMembers;
    membersToDisplay.map((each) => {
      const i = localFiltedMembers.findIndex(
        (item) => item.card_id === each.card_id
      );
      if (i < 0) localFiltedMembers.push(each);
    });
    setFiltedMembers(localFiltedMembers);
    setTimeout(() => {
      setLoad(false);
    }, [50]);
  };

  const removeAll = (e) => {
    e.preventDefault();
    setLoad(true);
    let localFiltedMembers = filtedMembers;
    membersToDisplay.map((each) => {
      const i = localFiltedMembers.findIndex(
        (item) => item.card_id === each.card_id
      );
      if (i >= 0) localFiltedMembers.splice(i, 1);
    });
    setFiltedMembers(localFiltedMembers);
    setTimeout(() => {
      setLoad(false);
    }, [50]);
  };

  const memberCheck = (member) => {
    let localFiltedMembers = filtedMembers;
    const i = localFiltedMembers.findIndex(
      (item) => item.card_id === member.card_id
    );
    if (i >= 0) return true;
    return false;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(values);
  };

  const save = (e) => {
    e.preventDefault();
    setValues({ ...values, tags: filtedMembers });
    setShowFilter(false);
  };

  const hideFilterBox = (e) => {
    e.preventDefault();
    setShowFilter(false);
    // // if (!editEvent) {
    // setAllMembers(members);
    // setKeyword("");
    // setValues1(initialValues1);
    // setFiltedMembers([]);
    // // }
  };

  const filteredItems = allMembers.filter((item) =>
    item.card_id.toLocaleLowerCase().includes(keyword)
  );

  const membersToDisplay = keyword ? filteredItems : allMembers;

  return (
    <form onSubmit={onSubmit} className="new-event-form">
      <div className="mb-3">
        <label htmlFor="new-title" className="form-label">
          Title
        </label>
        <input
          type="text"
          value={values.title}
          name="title"
          onChange={handleChange}
          className="form-control"
          id="new-title"
          aria-describedby="emailHelp"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="new-description" className="form-label">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={values.description}
          onChange={handleChange}
          className="form-control"
          id="new-description"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="location" className="form-label">
          Location
        </label>
        <input
          type="text"
          value={values.location}
          name="location"
          onChange={handleChange}
          className="form-control"
          id="location"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="number_of_guests" className="form-label">
          Number Of Guests
        </label>
        <input
          type="number"
          value={values.number_of_guests}
          name="number_of_guests"
          onChange={handleChange}
          className="form-control"
          id="number_of_guests"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-time-label" htmlFor="start">
          Start
        </label>
        <input
          type="time"
          name="start"
          value={values.start}
          className="form-control mb-3"
          id="start"
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-time-label" htmlFor="end">
          End
        </label>
        <input
          type="time"
          name="end"
          value={values.end}
          className="form-control mb-3"
          id="end"
          onChange={handleChange}
          required
        />
      </div>
      <hr />
      <div className="mb-3">
        <button
          className="btn btn-primary float-end"
          onClick={(e) => {
            e.preventDefault();
            setShowFilter(true);
          }}
        >
          Filter Members
        </button>
      </div>
      {showFilter && (
        <div className="filter-div-wrapper">
          <div className="filter-div">
            <div className="filter-header">
              <i className="box arrow fa fa-times" onClick={hideFilterBox} />
            </div>
            <div className="filter-save">
              <button className="btn btn-success" onClick={save}>
                Save
              </button>
            </div>
            <div className="filter-body">
              <div className="filtered-members-div">
                <h3>Filtered members</h3>
                <div className="mb-3">
                  <button onClick={removeAll} className="btn btn-dark">
                    Remove All
                  </button>
                </div>
                {!load ? (
                  <div className="filtered-members">
                    {filtedMembers && filtedMembers.length
                      ? filtedMembers.map((each, i) => (
                          <div key={i} className="filted-member">
                            <h6>{each.card_id}</h6>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleRemove(each);
                              }}
                              className="btn btn-danger"
                            >
                              remove
                            </button>
                          </div>
                        ))
                      : ""}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="all-members-filter-options">
                <h3>All members</h3>
                <div className="filter-options">
                  <div className="mb-3 row">
                    <div className="col-md-4">
                      <p>Age Range</p>
                    </div>
                    <div className="col-md-4">
                      <input
                        type="Number"
                        name="minAge"
                        min="0"
                        max={values1.maxAge ? values1.maxAge : "60"}
                        value={values1.minAge}
                        className="form-control mb-3"
                        id="minAge"
                        onChange={handleChange1}
                        onBlur={addMinimumValues}
                        placeholder="minmum age"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="Number"
                        name="maxAge"
                        min={values1.minAge ? values1.minAge : "0"}
                        max="60"
                        value={values1.maxAge}
                        className="form-control mb-3"
                        id="maxAge"
                        onChange={handleChange1}
                        onBlur={addMinimumValues}
                        placeholder="maximum age"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="male"
                        id="maleCheckBox"
                        onChange={handleOnlyMale}
                        checked={values1.male}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="maleCheckBox"
                      >
                        Male
                      </label>
                    </div>
                    <div className="col-md-6">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="female"
                        id="femaleCheckBox"
                        onChange={handleOnlyFemale}
                        checked={values1.female}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="femaleCheckBox"
                      >
                        Female
                      </label>
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <input
                      type="text"
                      className="form-control"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder="Enter Card ID"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <button onClick={addAll} className="btn btn-warning">
                    Add All
                  </button>
                </div>
                <div className="all-members-div">
                  {membersToDisplay && membersToDisplay.length
                    ? membersToDisplay.map((each, i) => (
                        <div key={i} className="each-member">
                          <h6>{each.card_id}</h6>
                          <p>{getAge(each.DOB)}</p>
                          <p>{each.gender == "male" ? "m" : "f"}</p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAdd(each);
                            }}
                            className="btn btn-primary"
                            disabled={memberCheck(each)}
                          >
                            Add
                          </button>
                        </div>
                      ))
                    : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <button type="submit" className="btn btn-primary float-end">
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddEventForm;
