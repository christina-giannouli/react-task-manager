import React, { Component } from 'react';
import axios, { AxiosResponse } from 'axios';
import NavBar from '../components/NavBar/NavBar';
import './TaskManagerPage.scss';
import BootstrapTable, { ColumnDescription } from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { TaskInterface } from '../interfaces/Task.interface';
import { TaskApiResponseInterface } from '../interfaces/TaskApiResponse.interface';
import { TaskManagerStateInterface } from '../interfaces/TaskManagerState.interface';
import * as Config from '../configuration/config';
import Dropdown from 'react-bootstrap/Dropdown';
import Moment from 'react-moment';
import { RouteProps } from 'react-router';

const { SearchBar, ClearSearchButton } = Search;

export default class TaskManagerPage extends Component<RouteProps, TaskManagerStateInterface> {
    /* actions dropdown */
    disabled: boolean = true;

    /* Initialize state */
    state: TaskManagerStateInterface = {
        tasks: [],
        columns: [],
        isLoaded: false,
    };

    componentDidMount() {
        this.getTasks();
    }

    getTasks(): void {
        axios
            .get<TaskApiResponseInterface>(`${Config.SERVER_URL}/tasks`)
            .then((response: AxiosResponse<TaskApiResponseInterface>) => {
                const action: string = 'Open';
                const tasks: TaskInterface[] = response.data.tasks.map((task: TaskInterface) => {
                    return { ...task, action };
                });

                this.setState({ tasks, columns: Config.columns, isLoaded: true });
            })
            .catch((error: any) => console.log(error));
    }

    render() {
        return (
            <div className="container-fluid">
                <NavBar />
                <div className="row pt-5">
                    <div className="col">
                        {this.state.isLoaded ? (
                            <ToolkitProvider
                                bootstrap4
                                keyField="id"
                                data={this.state.tasks}
                                columns={this.state.columns}
                                search
                            >
                                {(props) => (
                                    <div>
                                        <div className="row mb-4">
                                            <div className="col-4">
                                                <SearchBar {...props.searchProps} />
                                            </div>
                                            <div className="col-2">
                                                <ClearSearchButton
                                                    className="btn btn-secondary"
                                                    {...props.searchProps}
                                                />
                                            </div>
                                            <div className="col-6 text-right">
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        disabled={this.disabled}
                                                        variant="secondary"
                                                        id="dropdown-basic"
                                                    >
                                                        Select Action
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">
                                                            Edit
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">
                                                            Delete
                                                        </Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">
                                                            Update Status
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <BootstrapTable
                                            pagination={paginationFactory(Config.paginationOptions)}
                                            striped={true}
                                            hover={true}
                                            selectRow={Config.selectRow}
                                            headerClasses="table-header"
                                            {...props.baseProps}
                                        />
                                    </div>
                                )}
                            </ToolkitProvider>
                        ) : (
                            <div>Loading ...</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
