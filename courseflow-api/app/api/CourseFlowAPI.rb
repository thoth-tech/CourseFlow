class CourseFlowAPI < Grape::API
  format :json

  # Courses API
  resource :courses do

    desc "Return all courses."
    get do
      Course.all
    end

    desc "Return courses by interest area."
    params do
      requires :interest, type: String, desc: "Interest area param."
    end
    get :interests do
        courses = Course.all
        filtered_courses = Array.new

        courses.each do |course|
          interest_present = course.interests.include? params[:interest]
          if interest_present
            filtered_courses.push(course)
          end
        end

        filtered_courses
    end

    desc "Return course by id."
    params do
      requires :id, type: Integer, desc: "Course Id."
    end
    route_param :id do
      get do
        Course.find(params[:id])
      end
    end

    desc "Create a course."
    params do
      requires :name, type: String, desc: "Name of the course."
      requires :description, type: String, desc: "Description of the course."
      requires :year, type: Integer, desc: "Year of course."
      requires :interests, type: Array[String], desc: "List of interest categories associated with the course."
      requires :requirements, type: Array[JSON], desc: "List of requirements."
    end
    post do
      Course.create!({
        name: params[:name],
        description: params[:description],
        year: params[:year],
        interests: params[:interests],
        requirements: params[:requirements]
      })
    end

    desc "Update a course by id."
    params do
      requires :id, type: Integer, desc: "Course Id."
      optional :name, type: String, desc: "Name of the course."
      optional :description, type: String, desc: "Description of the course."
      optional :year, type: Integer, desc: "Year of course."
      optional :interests, type: Array[String], desc: "List of interest categories associated with the course."
      optional :requirements, type: Array[JSON], desc: "List of requirements."
    end
    put ":id" do
      course = Course.find(params[:id])
      course.update({
        name: params[:name] ? params[:name] : course.name,
        description: params[:description] ? params[:description] : course.description,
        year: params[:year] ? params[:year] : course.year,
        interests: params[:interests] ? params[:interests] : course.interests,
        requirements: params[:requirements] ? params[:requirements] : course.requirements,
      })
    end

    desc "Delete a course by id."
    params do
      requires :id, type: String, desc: "Course Id."
    end
    delete ':id' do
      Course.find(params[:id]).destroy
    end
    
  end

  # Units API
  resource :units do

    desc "Return all units."
    get do
      Unit.all
    end

    desc "Return unit by interest area."
    params do
      requires :interest, type: String, desc: "Interest area param."
    end
    get :interests do
        units = Unit.all
        filtered_units = Array.new

        units.each do |unit|
          interest_present = unit.interests.include? params[:interest]
          if interest_present
            filtered_units.push(unit)
          end
        end

        filtered_units
    end

    desc "Return unit by id."
    params do
      requires :id, type: Integer, desc: "Unit Id."
    end
    route_param :id do
      get do
        Unit.find(params[:id])
      end
    end

    desc "Create a unit."
    params do
      requires :name, type: String, desc: "Name of the unit."
      requires :description, type: String, desc: "Description of the unit."
      requires :year, type: Integer, desc: "Year of unit."
      requires :interests, type: Array[String], desc: "List of interest categories associated with the unit."
      requires :requirements, type: Array[JSON], desc: "List of requirements."
    end
    post do
      Unit.create!({
        name: params[:name],
        description: params[:description],
        year: params[:year],
        interests: params[:interests],
        requirements: params[:requirements]
      })
    end

    desc "Update a unit by id."
    params do
      requires :id, type: Integer, desc: "Unit Id."
      optional :name, type: String, desc: "Name of the unit."
      optional :description, type: String, desc: "Description of the unit."
      optional :year, type: Integer, desc: "Year of unit."
      optional :interests, type: Array[String], desc: "List of interest categories associated with the unit."
      optional :requirements, type: Array[JSON], desc: "List of requirements."
    end
    put ":id" do
      unit = Unit.find(params[:id])
      unit.update({
        name: params[:name] ? params[:name] : unit.name,
        description: params[:description] ? params[:description] : unit.description,
        year: params[:year] ? params[:year] : unit.year,
        interests: params[:interests] ? params[:interests] : unit.interests,
        requirements: params[:requirements] ? params[:requirements] : unit.requirements,
      })
    end

    desc "Delete a unit by id."
    params do
      requires :id, type: String, desc: "Unit Id."
    end
    delete ':id' do
      Unit.find(params[:id]).destroy
    end
  end
  
  # User API
  resource :users do

    desc "Return all users."
    get do
      User.all
    end

    desc "Return user by username"
    params do
      requires :username, type: String, desc: "Username of the user."
    end
    get :username do
        User.where("username" == params[:username])
    end

    desc "Create a user."
    params do
      requires :username, type: String, desc: "User's username"
      requires :password, type: String, desc: "User's hashed password"
      requires :name, type: String, desc: "User's fullname"
      requires :course_map, type: Array[JSON], desc: "User's coursemap"
    end
    post do
      User.create!({
        username: params[:username],
        password: params[:password],
        name: params[:name],
        course_map: params[:course_map]
      })
    end

    desc "Update a user by id."
    params do
      requires :id, type: Integer, desc: "User Id."
      optional :username, type: String, desc: "User's username"
      optional :password, type: String, desc: "User's hashed password"
      optional :name, type: String, desc: "User's fullname"
      optional :course_map, type: Array[JSON], desc: "User's coursemap"
    end
    put ":id" do
      user = User.find(params[:id])
      user.update({
        username: params[:username] ? params[:username] : user.username,
        password: params[:password] ? params[:password] : user.password,
        name: params[:name] ? params[:name] : user.name,
        course_map: params[:course_map] ? params[:course_map] : user.course_map,
      })
    end

    desc "Delete a user by id."
    params do
      requires :id, type: String, desc: "User Id."
    end
    delete ':id' do
      User.find(params[:id]).destroy
    end

  end

end