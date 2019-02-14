Dynamic Form Gem

This gem allows the user to create a dynamic form where it is driven
almost completely on the server side.

In order to accomplish this, this gem relies on another gem that you must be using to 
be able to use this: **turbograft**. Turbograft is a hard fork of the **turbolinks** 
gem and it allows you to generate a page as normal and replace just parts of it.

To install it, add this to your Gemfile and bundle install.

```
gem 'dynamic_form'
```

Also require the javascript piece in your application.js

```
//= require dynamic_form
```

To show how to use it, I will present a standard rails form view and show how it
would be dynamic. Here is the starting view.

```erbruby
<%= form_with(model: widget, local: true) do |form| %>
<% if widget.errors.any? %>
  <div id="error_explanation">
    <h2><%= pluralize(widget.errors.count, "error") %> prohibited this widget from being saved:</h2>

    <ul>
    <% widget.errors.full_messages.each do |message| %>
      <li><%= message %></li>
    <% end %>
    </ul>
  </div>
<% end %>

<div class="field">
  <%= form.label :color %>
  <%= form.text_field :color %>
</div>

<div class="field">
  <%= form.label :name %>
  <%= form.text_field :name %>
</div>

<div class="field">
  <%= form.label :price %>
  <%= form.text_field :price %>
</div>

<div class="field">
  <%= form.label :on_sale %>
  <%= form.check_box :on_sale, class: 'check-box-class %>
</div>

<div class="field" id="sale_price">
  <% if form.object.on_sale %>
    <%= form.label :sale_price %>
    <%= form.text_field :sale_price %>

    <div class="field">
      <%= form.label :on_super_sale %>
      <%= form.check_box :on_super_sale %>
    </div>

    <% if form.object.on_super_sale %>
      <%= form.label :super_sale_price %>
      <%= form.text_field :super_sale_price %>
    <% else  %>
      <%= form.hidden_field :super_sale_price %>
    <% end %>
  <% else %>
    <%= form.hidden_field :sale_price %>
  <% end %>
</div>

<div class="actions">
  <%= form.submit %>
</div>
<% end %>
```

To use it in a view, you wrap your table in a block like so:

```erbruby
<%= DynamicForm::Form.new(view: self, refresh_path: refresh_form_widgets_path, form_object: :widget).generate do |dt| %>
  <%= form_with(model: widget, local: true) do |form| %>
    <% if widget.errors.any? %>
      <div id="error_explanation">
        <h2><%= pluralize(widget.errors.count, "error") %> prohibited this widget from being saved:</h2>

        <ul>
        <% widget.errors.full_messages.each do |message| %>
          <li><%= message %></li>
        <% end %>
        </ul>
      </div>
    <% end %>

    <div class="field">
      <%= form.label :color %>
      <%= form.text_field :color, dt.refresh_on_change %>
    </div>

    <div class="field">
      <%= form.label :name %>
      <%= form.text_field :name %>
    </div>

    <div class="field">
      <%= form.label :price %>
      <%= form.text_field :price %>
    </div>

    <div class="field">
      <%= form.label :on_sale %>
      <%= form.check_box :on_sale, dt.refresh_on_change(class: 'check-box-class') %>
    </div>

    <div class="field" id="sale_price">
      <% if form.object.on_sale %>
        <%= form.label :sale_price %>
        <%= form.text_field :sale_price %>

        <div class="field">
          <%= form.label :on_super_sale %>
          <%= form.check_box :on_super_sale, dt.refresh_on_change %>
        </div>

        <% if form.object.on_super_sale %>
          <%= form.label :super_sale_price %>
          <%= form.text_field :super_sale_price %>
        <% else  %>
          <%= form.hidden_field :super_sale_price %>
        <% end %>
      <% else %>
        <%= form.hidden_field :sale_price %>
      <% end %>
    </div>

    <div class="actions">
      <%= form.submit %>
    </div>
  <% end %>
<% end %>
```

To go with that, you need to define a controller collection action that is hit to 
refresh the form on changes in the DynamicForm argument. It shouldn't save or update
the form model, only check validations or update the in memory model as appropriate.

```ruby
# routes.rb
 resources :widgets do
   # insert the following to enable the path for the refresh form action
   collection do
     get refresh_form
   end
 end 
```

```ruby
  def refresh_form
    if params[:form_object_id]
      @widget = Widget.find(params[:form_object_id])
      @widget.assign_attributes(widget_params)
      
      # Use an attribute accessor if you want to distinguish between valid states when saving
      # vs when you are editing a form 
      # @widget.refresing_form = true
    else
      @widget = Widget.new(widget_params)
    end
    @widget.valid?
    respond_to do |format|
      format.html { render :new }
    end
  end
```

The result of all this is that you can do a simple dynamic form without having to
do javascript and have logic to support the form both in ruby and javascript.



