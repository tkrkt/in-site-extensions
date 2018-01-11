import * as React from 'react';
import {connect} from 'react-redux';
import {bind} from 'decko';

import BookmarkTree from '../components/bookmarktree';
import {removeBookmark, removeHost} from '../actions';
import {Store, Hosts} from '../reducers';

interface StateProps {
  hosts: Hosts;
}

interface DispatchProps {
  removeBookmark: typeof removeBookmark;
  removeHost: typeof removeHost;
}

const OptionContainer = (props: StateProps & DispatchProps) => {
  // tslint:disable:no-shadowed-variable
  const {hosts, removeHost, removeBookmark} = props;
  return (
    <div>
      <p>Stored bookmarks:</p>
      <BookmarkTree
        hosts={hosts}
        onRemoveHost={removeHost}
        onRemoveBookmark={removeBookmark} />
    </div>
  );
};

const mapStateToProps = (state: Store): StateProps => ({
  hosts: state.hosts
});

const mapDispatchToProps: DispatchProps = {
  removeBookmark,
  removeHost
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionContainer);
