
import * as React from 'react';
import {bind} from 'decko';

interface Props {
  className?: string;
  url: string;
}

interface State {
  error: boolean;
}

export default class Favicon extends React.Component<Props, State> {
  state = {
    error: false
  };

  @bind
  onError() {
    this.setState({error: true});
  }

  render() {
    const {url, className} = this.props;
    if (url && !this.state.error) {
      return (
        <img
          src={url}
          className={className}
          onError={this.onError}/>
      );
    } else {
      return null;
    }
  }
}
