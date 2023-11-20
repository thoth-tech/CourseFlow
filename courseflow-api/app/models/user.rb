class User < ApplicationRecord
  serialize :course_map, coder: JSON
end
