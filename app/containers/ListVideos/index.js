/**
 *
 * ListVideos
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import { Alert, Button } from 'reactstrap';
import matchSorter from 'match-sorter'

import { getDataAction } from "./actions";
import makeSelectListVideos from "./selectors";

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";


/* eslint-disable react/prefer-stateless-function */
export class ListVideos extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    // we are fetching videos listfrom backend api by callling the action
    this.props.getDataAction();
  }

  renderTable = () => {
    const { videos_list } = this.props.listVideos;
    return <ReactTable
    getTdProps={() => ({
      style: {
      textAlign: 'center'
      }
      })}
      data={videos_list}
      filterable
      columns={[
        {
          columns: [
            {
              Header: "Thumbnail",
              filterable:false,
              Cell: row => (
                  <img src={row.original.thumbUrl} style={{width:'50px', height:'50px'}} />
              )
            },
            {
              Header: "Category",
              accessor: "category",
              filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["category"] }),
                  filterAll: true
            },
            {
              Header: "Title",
              accessor: "title",
              filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["title"] }),
                  filterAll: true
            },
            {
              Header: "Description",
              accessor: "description",
              filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["description"] }),
                  filterAll: true
            },
            {
              Header: "Running Time",
              accessor: "runningTime",
              filterable:false,
              Cell: row => {
                function pad(num) {
                  return ("0"+num).slice(-2);
                }
                let secs = row.original.runningTime;
                var minutes = Math.floor(secs / 60);
                secs = secs%60;
                var hours = Math.floor(minutes/60)
                minutes = minutes%60;
                return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
              }
            },
            {
              Header: "Play",
              accessor: "play",              
              filterable:false,              
              Cell: row => (
                  <div>
                      <Link to={{
                        pathname:"/video-detail", 
                        state: {
                          url: row.original.videoUrl,
                          title: row.original.title,
                          description: row.original.description,
                        }
                      }}

                       >
                        Play
                      </Link>
                  </div>
              )
            },

          ]
        }
      ]}
      defaultPageSize={10}
      className="-striped -highlight"
    />

  }


  render() {
    return (
      <div>
        {this.renderTable()}
      </div>
    );
  }
}

ListVideos.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  listVideos: makeSelectListVideos(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    getDataAction: () => dispatch(getDataAction()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'listVideos', reducer });
const withSaga = injectSaga({ key: 'listVideos', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ListVideos);
