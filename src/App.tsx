import { Component } from 'react';

import Table from './Table';

export default class App extends Component<{}, { nests: Nest[] }> {
  state = {
    nests: []
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

  componentDidMount() {
    const events = new EventSource('/api/v1/sse/events');
    events.onmessage = (event) => {
      this.updateNests(JSON.parse(event.data));
    };
  }

  render() {
    return (
      <div className="app">
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
