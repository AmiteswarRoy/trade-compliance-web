import settingsProvider from 'utils/settings-provider';

type State = {
  author: ?string,
  title: ?string,
  titleBase: ?string,
  description: ?string,
  statusCode: ?number
};

class HelmetStore {

  constructor() {
    this.bindActions(this.alt.getActions('helmet'));

    this.state = {
      title: '',
      titleBase: settingsProvider.get('HELMET.TITLE_BASE'),
      description: settingsProvider.get('HELMET.DESCRIPTION'),
      author: settingsProvider.get('HELMET.AUTHOR'),
      statusCode: 200
    };
  }

  onUpdate(props: State) {
    this.setState({ ...this.state, ...props });
  }

}

export default HelmetStore;
