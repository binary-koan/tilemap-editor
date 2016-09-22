'use babel';
import m from 'mithril';

export default function TextInput({ label, value, suffix, onChange }) {
  value = value == null ? '' : value.toString();

  function emitChanged(input) {
    typeof(onChange) === 'function' && onChange(input.getModel().getText());
  }

  function subscribeToInput(el, isInitialized) {
    if (!isInitialized) {
      const input = el.querySelector('atom-text-editor');
      input.getModel().onDidStopChanging(() => emitChanged(input));
    }

    checkInputValue(el);
  }

  function checkInputValue(el) {
    const input = el.querySelector('atom-text-editor');

    if (value && input.getModel().getText() !== value) {
      input.getModel().setText(value);
    }
  }

  return m('.control-group', [
    m('label.control-label', label),
    m('.controls', { config: subscribeToInput }, [
      m('.input', { innerHTML: '<atom-text-editor mini />' }),
      suffix
    ])
  ]);
}
