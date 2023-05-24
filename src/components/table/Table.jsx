import { Skeleton } from "antd";
import React, { useState, useEffect } from "react";

import "./table.css";

const renderCustomerBodySkeleton = () => {
    return <tr>
        <th> <Skeleton.Input active size="small" block /></th>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
        <td> <Skeleton.Input active size="small" block /></td>
    </tr>
}


const Table = (props) => {
    const [dataShow, setDataShow] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const initDataShow =
            props.limit && props.bodyData
                ? props.bodyData.slice(0, Number(props.limit))
                : props.bodyData;
        const data = initDataShow.map((x, index) => {
            return {
                ...x,
                stt: index + 1
            }
        })
        setDataShow(data);
    }, [props]);

    let pages = 1;

    let range = [];

    if (props.limit !== undefined && props.bodyData !== undefined) {
        let page = Math.floor(props.bodyData.length / Number(props.limit));
        pages =
            props.bodyData.length % Number(props.limit) === 0 ? page : page + 1;
        range = [...Array(pages).keys()];
    }

    const [currPage, setCurrPage] = useState(0);

    const selectPage = (page) => {
        setIsLoading(true)
        const start = Number(props.limit) * page;
        const end = start + Number(props.limit);

        const data = props.bodyData.slice(start, end).map((x, index) => {
            return {
                ...x,
                stt: start + index + 1
            }
        })

        setTimeout(() => {
            setIsLoading(false)
            setDataShow(data);
            setCurrPage(page);
        }, 200)

    };

    return (
        <div>
            <div className="table-wrapper">
                <table>
                    {props.headData && props.renderHead ? (
                        <thead>
                            <tr>
                                {props.headData.map((item, index) =>
                                    props.renderHead(item, index)
                                )}
                            </tr>
                        </thead>
                    ) : null}
                    {props.bodyData && props.renderBody ? (
                        <tbody>
                            {
                                isLoading ? [1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map(_ => renderCustomerBodySkeleton()) :
                                    dataShow.map((item, index) =>
                                        props.renderBody(item, index)
                                    )}
                        </tbody>
                    ) : null}
                </table>
            </div>
            {pages > 1 ? (
                <div className="table__pagination">
                    {range.map((item, index) => (
                        <div
                            key={index}
                            className={`table__pagination-item ${currPage === index ? "active" : ""
                                }`}
                            onClick={() => selectPage(index)}
                        >
                            {item + 1}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default Table;
