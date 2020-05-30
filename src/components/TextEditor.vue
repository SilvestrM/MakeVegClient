<template>
  <div>
    <editor-menu-bar :editor="editor" keep-in-bounds v-slot="{ commands, isActive}">
      <div class="level is-mobile is-marginless has-background-light">
        <div class="level-left">
          <div class="level-item">
            <div class="field has-addons">
              <p class="control">
                <b-tooltip type="is-light" :delay="500" position="is-bottom" label="Bold" animated>
                  <button
                    class="button"
                    :class="{ 'is-active': isActive.bold() }"
                    @click.prevent="commands.bold"
                  >
                    <b-icon icon="format-bold" />
                  </button>
                </b-tooltip>
              </p>
              <p class="control">
                <b-tooltip
                  type="is-light"
                  :delay="500"
                  position="is-bottom"
                  label="Italic"
                  animated
                >
                  <button
                    class="button"
                    :class="{ 'is-active': isActive.italic() }"
                    @click.prevent="commands.italic"
                  >
                    <b-icon icon="format-italic" />
                  </button>
                </b-tooltip>
              </p>
              <p class="control">
                <b-tooltip
                  type="is-light"
                  :delay="500"
                  position="is-bottom"
                  label="Underline"
                  animated
                >
                  <button
                    class="button"
                    :class="{ 'is-active': isActive.underline() }"
                    @click.prevent="commands.underline"
                  >
                    <b-icon icon="format-underline" />
                  </button>
                </b-tooltip>
              </p>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="field has-addons">
              <p class="control">
                <b-tooltip type="is-light" :delay="500" position="is-bottom" label="Undo" animated>
                  <button class="button" @click.prevent="commands.undo">
                    <b-icon icon="undo" />
                  </button>
                </b-tooltip>
              </p>
              <p class="control">
                <b-tooltip type="is-light" :delay="500" position="is-bottom" label="Redo" animated>
                  <button class="button" @click.prevent="commands.redo">
                    <b-icon icon="redo" />
                  </button>
                </b-tooltip>
              </p>
            </div>
          </div>
        </div>
      </div>
    </editor-menu-bar>
    <EditorContent style="max-height:auto" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  Bold,
  Italic,
  Underline,
  Placeholder,
  History
} from "tiptap-extensions";

export default {
  props: {
    value: String
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Bold(),
          new Italic(),
          new Underline(),
          new History(),
          new Placeholder({
            emptyNodeText: "Prepare and boil for 20 minutes...",
            showOnlyWhenEditable: true,
            showOnlyCurrent: true
          })
        ],
        content: this.value,

        onUpdate: ({ getHTML }) => {
          this.$emit("input", getHTML());
        }
      })
    };
  },
  computed: {
    // editor() {
    //   return new Editor({
    //     extensions: [
    //       new Bold(),
    //       new Italic(),
    //       new Underline(),
    //       new History(),
    //       new Placeholder({
    //         emptyNodeText: "Prepare and boil for 20 minutes...",
    //         showOnlyWhenEditable: true,
    //         showOnlyCurrent: true
    //       })
    //     ],
    //     content: this.value,
    //     onUpdate: ({ state, getHTML, transaction }) => {
    //       console.log(state, getHTML(), transaction);
    //       this.$emit("input", getHTML());
    //     }
    //   });
    // }
  },
  components: {
    EditorContent,
    EditorMenuBar
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>

<style>
</style>