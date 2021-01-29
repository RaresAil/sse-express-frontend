import { Component } from 'react';

import Table from './Table';

export default class App extends Component<
  {},
  { nests: Nest[]; loading: boolean; message: string; userId: string }
> {
  state = {
    nests: [],
    loading: true,
    message: 'Loading...',
    userId: ''
  };

  private updateNests = (nestData: Nest) => {
    if (Array.isArray(nestData)) {
      this.setState({
        nests: nestData
      });
    } else {
      const currentNest = this.state.nests.findIndex(
        ({ id }) => id === nestData.id
      );

      if (currentNest >= 0) {
        const nsts: Nest[] = [...this.state.nests];
        nsts[currentNest] = nestData;
        this.setState({
          nests: nsts
        });
      } else {
        this.setState({
          nests: [...this.state.nests, nestData]
        });
      }
    }
  };

  async componentDidMount() {
    const { userId } = await (
      await fetch('/api/v1/sse/me', {
        method: 'GET'
      })
    ).json();

    if (!userId) {
      return this.setState({
        message:
          'Use "/api/v1/sse/login" to create a new session, the path paremter "id" is optional'
      });
    }

    const events = new EventSource('/api/v1/sse/events');
    events.onmessage = (event) => {
      this.updateNests(JSON.parse(event.data));
    };

    this.setState({
      loading: false,
      userId
    });
  }

  render() {
    if (this.state.loading) {
      return <div>{this.state.message}</div>;
    }

    return (
      <div className="app">
        <div>User: {this.state.userId}</div>
        <Table data={this.state.nests} />
      </div>
    );
  }
}

export interface Nest {
  id: number;
  country: string;
  code: string;
  currency: string;
  level: number;
  units: string;
  total: number;
  quantity: number;
}
