require_relative 'dynamic_form/engine'

module DynamicForm
  class DynamicForm
    def initialize(view:, refresh_path:, form_id:)
      @view = view
      @refresh_path = refresh_path
      @id = "dynamic-form-" + form_id.to_s
    end

    def generate(&block)
      ("<div id=\"#{@id}\" data-tg-refresh=\"#{@id}\">" + @view.capture(self, &block) + "</div>" + script_tag).html_safe
    end

    def script_tag
      ("<script>" +
        "$(function() { (new DynamicForm(" + dynamic_table_options.to_json + ")).initialize() });" +
        "</script>")
    end

    def dynamic_table_options
      {
        inputs:       @inputs,
        refresh_path: @refresh_path,
        id:           @id
      }
    end
  end
end
