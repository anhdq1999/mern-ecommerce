import React, {useEffect, useReducer, useState} from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import logger from "use-reducer-logger";
import {Col, Row} from "react-bootstrap";
import Product from "../component/Product";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, products: action.payload, loading: false};
        case 'FETCH_ERROR':
            return {...state, loading: false, error: action.payload};
        default:
            return false;
    }
}

function HomeScreen() {
    const [{loading, error, products}, dispatch] = useReducer(logger(reducer), {
        products: [],
        loading: true,
        error: ''
    })
    // const [products, setProducts] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: 'FETCH_REQUEST'});
            try {
                const results = await axios.get('/api/products')
                dispatch({type: 'FETCH_SUCCESS', payload: results.data})
            } catch (err) {
                dispatch({type: 'FETCH_ERROR', payload: err.message})
            }
            // setProducts(results.data)
        };
        fetchData();
    }, [])

    return (
        <div>
            <h1>Featured Products</h1>
            <div className="products">
                {
                    loading ? (<div>Loading...</div>) : error ? (<div>{error}</div>) : (
                        <Row>
                            {products.map((product) => (
                                    <Col sm={6} md={4} lg={3} className='mb-3'>
                                      <Product product = {product}/>
                                    </Col>
                                )
                            )}
                        </Row>
                    )
                }
            </div>
        </div>
    );
}

export default HomeScreen;