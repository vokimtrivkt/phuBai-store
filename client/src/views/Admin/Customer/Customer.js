import clsx from "clsx";
import React, { useContext, useRef, useState } from "react";
import { useTitle } from "../../../hooks/useTitle";
import { useGetData } from "../../../hooks/useGetData";
import { useSort } from "../../../hooks/useSort";
import { useFindInArray } from "../../../hooks/useFindInArray";

import { CustomerContext } from "../../../contexts/CustomerContext";
import { OptionContext } from "../../../contexts/OptionContext";
import Loading from "../../../components/common/Loading/Loading";
import EmptyPage from "../../../components/common/EmptyPage/EmptyPage";
import Styles from "./Styles/Styles.module.scss";
import PageStyles from "../../Styles/PageStyles.module.scss";

import { BiSearchAlt } from "react-icons/bi";
import { MdCancel, MdDeleteForever } from "react-icons/md";
import {
  IoCaretBackOutline,
  IoCaretDown,
  IoCaretForwardOutline,
  IoCaretUp,
} from "react-icons/io5";

function Customer() {
  useTitle("Customer");
  const {
    optionState: { theme },
  } = useContext(OptionContext);
  const {
    customerState: { customers, customersLoading },
    getCustomers,
    deleteCustomer,
  } = useContext(CustomerContext);
  const ref = useRef();
  const [findState, setFindState, find] = useFindInArray("");
  const [sortState, setSort, sort] = useSort("cccd");

  const handleSetSort = (value) => {
    setPageActive(0);
    setSort(value);
  };
  const handleSort = () => {
    return sort(handleFind());
  };
  const handleFind = () => {
    return find(customers, findState);
  };
  const handleChangeFindValue = (value) => {
    setPageActive(0);
    setFindState(value);
  };
  const [pageActive, setPageActive] = useState(0);
  let page = Math.round((handleFind().length - 1) / 10 - 0.5);

  const handleDelete = (e, _id) => {
    e.stopPropagation();
    deleteCustomer(_id);
  };

  useGetData(() => {
    getCustomers();
  });

  let body;
  if (customersLoading) {
    body = <Loading />;
  } else {
    if (customers.length === 0) {
      body = <EmptyPage />;
    } else {
      body = (
        <div className={PageStyles.data}>
          <div className={PageStyles.header}>
            <div className={PageStyles.search}>
              <i
                className={clsx(PageStyles.icon, PageStyles.search__icon)}
                onClick={() => ref.current?.focus()}
              >
                <BiSearchAlt className={PageStyles.svg} />
              </i>
              <input
                className={PageStyles.search}
                ref={ref}
                type="text"
                placeholder="Enter text..."
                value={findState}
                onChange={(e) => {
                  handleChangeFindValue(e.target.value);
                }}
              />
              <i
                className={clsx(
                  PageStyles.icon,
                  PageStyles.clear__icon,
                  findState.length > 0 ? null : PageStyles.hide
                )}
                onClick={() => {
                  handleChangeFindValue("");
                  ref.current?.focus();
                }}
              >
                <MdCancel className={PageStyles.svg} />
              </i>
            </div>
          </div>
          <div className={PageStyles.body}>
            <div className={PageStyles.table}>
              <div className={PageStyles.table__head}>
                <div className={Styles.index}>STT</div>
                <div
                  className={Styles.cccd}
                  onClick={() => handleSetSort("cccd")}
                >
                  <div className={Styles.text}>CCCD</div>
                  <i className={PageStyles.icon}>
                    {sortState.value === "cccd" ? (
                      sortState.type === "asc" ? (
                        <IoCaretDown className={PageStyles.svg} />
                      ) : (
                        <IoCaretUp className={PageStyles.svg} />
                      )
                    ) : null}
                  </i>
                </div>
                <div
                  className={Styles.fullName}
                  onClick={() => handleSetSort("fullName")}
                >
                  <div className={Styles.text}>FullName</div>
                  <i className={PageStyles.icon}>
                    {sortState.value === "fullName" ? (
                      sortState.type === "asc" ? (
                        <IoCaretDown className={PageStyles.svg} />
                      ) : (
                        <IoCaretUp className={PageStyles.svg} />
                      )
                    ) : null}
                  </i>
                </div>
                <div className={Styles.birthday}>
                  <div className={Styles.text}>Birthday</div>
                </div>
                <div className={Styles.phone}>
                  <div className={Styles.text}>Phone</div>
                </div>
              </div>
              <div className={PageStyles.table__body}>
                {handleSort().map(function (item, index) {
                  if (
                    index >= pageActive * 10 &&
                    index < (pageActive + 1) * 10
                  ) {
                    return (
                      <div
                        key={index}
                        className={clsx(
                          PageStyles.item,
                          index % 2 === 1 ? PageStyles.dark : null
                        )}
                      >
                        <div className={PageStyles.item__wrapper}>
                          <div className={Styles.index}>{index + 1}</div>
                          <div className={Styles.cccd}>{item.cccd}</div>
                          <div className={Styles.fullName}>{item.fullName}</div>
                          <div className={Styles.birthday}>{item.birthday}</div>
                          <div className={Styles.phone}>{item.phone}</div>
                        </div>
                        <i
                          className={clsx(
                            PageStyles.icon,
                            PageStyles.delete__icon
                          )}
                          onClick={(e) => handleDelete(e, item._id)}
                        >
                          <MdDeleteForever className={PageStyles.svg} />
                        </i>
                      </div>
                    );
                  } else return null;
                })}
              </div>
            </div>
          </div>
          <div className={PageStyles.footer}>
            <div>{`Total: ${handleSort().length} elements.`}</div>
            <div className={PageStyles.page}>
              <i
                className={clsx(
                  PageStyles.icon,
                  pageActive === 0 ? PageStyles.disabled : null
                )}
                onClick={() => {
                  if (pageActive !== 0) {
                    setPageActive(pageActive - 1);
                  }
                }}
              >
                <IoCaretBackOutline className={PageStyles.svg} />
              </i>
              <div className={PageStyles.index}>{pageActive + 1}</div>
              <i
                className={clsx(
                  PageStyles.icon,
                  pageActive === page ? PageStyles.disabled : null
                )}
                onClick={() => {
                  if (pageActive !== page) {
                    setPageActive(pageActive + 1);
                  }
                }}
              >
                <IoCaretForwardOutline className={PageStyles.svg} />
              </i>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className={clsx(PageStyles.content, PageStyles[theme])}>
      <div className={PageStyles.title}>Customer</div>
      {body}
    </div>
  );
}

export default Customer;
