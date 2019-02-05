require_relative 'dynamic_form/engine'

module DynamicForm
  class Form
    def initialize(view:, refresh_path:, form_object:, form_id: nil)
      @view = view
      @refresh_path = refresh_path
      @form_object_id = form_object.id
      @form_id = (form_id || form_object.model_name.singular)
      @dom_id = "dynamic-form-" + @form_id
    end

    def generate(&block)
      ("<div id=\"#{@dom_id}\" data-tg-refresh=\"#{@dom_id}\">" + @view.capture(self, &block) + "</div>" + script_tag).html_safe
    end

    def refresh_on_change(html_options={})
      html_options.merge({"data-refresh-on" => "change"})
    end

    def script_tag
      ("<script>" +
        "$(function() { (new DynamicForm(" + dynamic_table_options.to_json + ")).initialize() });" +
        "</script>")
    end

    def dynamic_table_options
      {
        inputs:           @inputs,
        refresh_path:     @refresh_path,
        dom_id:           @dom_id,
        form_id:          @form_id,
        form_object_id:   @form_object_id
      }
    end
  end
end
